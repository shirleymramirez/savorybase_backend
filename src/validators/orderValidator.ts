import { z } from "zod";

import { orderStatuses } from "../models/Order";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Must be a valid MongoDB ObjectId");

const orderItemInputSchema = z.object({
  food_item_id: objectIdSchema,
  quantity: z.coerce.number().int().min(1).default(1),
  modifier_item_ids: z.array(objectIdSchema).default([])
});

const createOrderSchema = z.object({
  status: z.enum(orderStatuses).optional(),
  items: z.array(orderItemInputSchema).min(1, "At least one order item is required")
});

const updateOrderSchema = z.object({
  status: z.enum(orderStatuses).optional(),
  items: z.array(orderItemInputSchema).min(1, "At least one order item is required").optional()
}).refine((value) => value.status || value.items, {
  message: "Provide a status or items to update"
});

type OrderItemInput = z.infer<typeof orderItemInputSchema>;
type CreateOrderInput = z.infer<typeof createOrderSchema>;
type UpdateOrderInput = z.infer<typeof updateOrderSchema>;

export {
  createOrderSchema,
  updateOrderSchema
};
export type {
  CreateOrderInput,
  OrderItemInput,
  UpdateOrderInput
};
