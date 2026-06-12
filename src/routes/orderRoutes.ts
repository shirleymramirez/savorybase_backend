import express from "express";

import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder
} from "../controllers/orderController.ts";
import validate from "../middleware/validateRequest.ts";
import {
  createOrderSchema,
  updateOrderSchema
} from "../validators/orderValidator.ts";

const router = express.Router();

router.get("/", getOrders);
router.post("/", validate(createOrderSchema), createOrder);
router.get("/:id", getOrderById);
router.put("/:id", validate(updateOrderSchema), updateOrder);
router.patch("/:id", validate(updateOrderSchema), updateOrder);
router.delete("/:id", deleteOrder);

export default router;
