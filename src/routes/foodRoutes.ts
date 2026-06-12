import { type NextFunction, type Request, type Response } from "express";
import express from "express";

import {
  createFood,
  getFoods,
  updateFood,
  deleteFood
} from "../controllers/foodController.ts";
import { protect } from "../middleware/authMiddleware.ts";
import validate from "../middleware/validateRequest.ts";
import upload from "../middleware/uploadMiddleware.ts";
import {
  createFoodSchema,
  updateFoodSchema
} from "../validators/foodValidator.ts";
import { sendError } from "../utils/apiResponse.ts";

const router = express.Router();

const hasValidatedImageUrl = (data: unknown): data is { imageUrl: string } => {
  return typeof data === "object" && data !== null && "imageUrl" in data && typeof data.imageUrl === "string";
};

const ensureCreatePayload = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.file && !hasValidatedImageUrl(req.validatedData)) {
    sendError(res, 400, "Provide an image upload or a valid imageUrl");
    return;
  }

  next();
};

const ensureUpdatePayload = (req: Request, res: Response, next: NextFunction): void => {
  const hasBodyFields = Object.keys(req.validatedData || {}).length > 0;

  if (!hasBodyFields && !req.file) {
    sendError(res, 400, "At least one field or image upload is required for update");
    return;
  }

  next();
};

router.get("/", getFoods);

router.post(
  "/",
  protect,
  upload.single("image"),
  validate(createFoodSchema),
  ensureCreatePayload,
  createFood
);
router.put(
  "/:id",
  protect,
  upload.single("image"),
  validate(updateFoodSchema),
  ensureUpdatePayload,
  updateFood
);
router.delete("/:id", protect, deleteFood);

export default router;
