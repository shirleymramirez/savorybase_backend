import { Request, Response } from "express";
import { Types } from "mongoose";

import FoodItem from "../models/FoodItem";
import ModifierItem from "../models/ModifierItem";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import OrderModifier from "../models/OrderModifier";
import asyncHandler from "../middleware/asyncHandler";
import { sendError, sendSuccess } from "../utils/apiResponse";
import { CreateOrderInput, OrderItemInput, UpdateOrderInput } from "../validators/orderValidator";

const serializeOrder = async (orderId: Types.ObjectId | string) => {
  const order = await Order.findById(orderId).lean({ virtuals: true });

  if (!order) {
    return null;
  }

  const items = await OrderItem.find({ order_id: order._id }).sort({ created_at: 1 }).lean({ virtuals: true });
  const itemIds = items.map((item) => item._id);
  const modifiers = await OrderModifier.find({ order_item_id: { $in: itemIds } })
    .sort({ created_at: 1 })
    .lean({ virtuals: true });

  return {
    ...order,
    items: items.map((item) => ({
      ...item,
      modifiers: modifiers.filter((modifier) => modifier.order_item_id.toString() === item._id.toString())
    }))
  };
};

const createOrderLines = async (orderId: Types.ObjectId, items: OrderItemInput[]): Promise<void> => {
  for (const item of items) {
    const food = await FoodItem.findById(item.food_item_id);

    if (!food) {
      throw new Error(`Food item not found: ${item.food_item_id}`);
    }

    const orderItem = await OrderItem.create({
      order_id: orderId,
      food_item_id: food._id,
      name_at_time_of_order: food.name,
      description_at_time_of_order: food.description,
      price_at_time_of_order: food.price,
      quantity: item.quantity
    });

    const modifierIds = [...new Set(item.modifier_item_ids)];

    if (modifierIds.length > 0) {
      const modifiers = await ModifierItem.find({
        _id: { $in: modifierIds },
        active: true
      });

      if (modifiers.length !== modifierIds.length) {
        throw new Error("One or more modifier items were not found");
      }

      await OrderModifier.insertMany(
        modifiers.map((modifier) => ({
          order_item_id: orderItem._id,
          modifier_item_id: modifier._id,
          name: modifier.name,
          price_adjustment: modifier.price_adjustment
        }))
      );
    }

  }
};

const removeOrderLines = async (orderId: Types.ObjectId): Promise<void> => {
  const existingItems = await OrderItem.find({ order_id: orderId }).select("_id");
  const existingItemIds = existingItems.map((item) => item._id);

  await OrderModifier.deleteMany({ order_item_id: { $in: existingItemIds } });
  await OrderItem.deleteMany({ order_id: orderId });
};

const getOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await Order.find().sort({ created_at: -1 }).lean({ virtuals: true });
  const fullOrders = await Promise.all(orders.map((order) => serializeOrder(order._id)));

  return sendSuccess(res, 200, "Orders fetched successfully", fullOrders);
});

const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.validatedData as CreateOrderInput;
  const order = await Order.create({
    status: payload.status || "pending"
  });

  try {
    await createOrderLines(order._id, payload.items);
  } catch (error) {
    await Order.findByIdAndDelete(order._id);
    await removeOrderLines(order._id);

    return sendError(res, 400, error instanceof Error ? error.message : "Unable to create order");
  }

  const fullOrder = await serializeOrder(order._id);

  return sendSuccess(res, 201, "Order created successfully", fullOrder);
});

const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await serializeOrder(req.params.id);

  if (!order) {
    return sendError(res, 404, "Order not found");
  }

  return sendSuccess(res, 200, "Order fetched successfully", order);
});

const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.validatedData as UpdateOrderInput;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return sendError(res, 404, "Order not found");
  }

  if (payload.status) {
    order.status = payload.status;
    await order.save();
  }

  if (payload.items) {
    try {
      await removeOrderLines(order._id);
      await createOrderLines(order._id, payload.items);
    } catch (error) {
      return sendError(res, 400, error instanceof Error ? error.message : "Unable to update order items");
    }
  }

  const fullOrder = await serializeOrder(order._id);

  return sendSuccess(res, 200, "Order updated successfully", fullOrder);
});

const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: "canceled"
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!order) {
    return sendError(res, 404, "Order not found");
  }

  const canceledAt = order.canceled_at || new Date();
  const items = await OrderItem.find({ order_id: order._id }).select("_id");
  const itemIds = items.map((item) => item._id);

  await OrderItem.updateMany({ order_id: order._id }, { canceled_at: canceledAt });
  await OrderModifier.updateMany({ order_item_id: { $in: itemIds } }, { canceled_at: canceledAt });

  const fullOrder = await serializeOrder(order._id);

  return sendSuccess(res, 200, "Order canceled successfully", fullOrder);
});

export {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder
};
