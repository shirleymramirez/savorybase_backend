import { type Request, type Response } from "express";

import FoodItem from "../models/FoodItem.ts";
import asyncHandler from "../middleware/asyncHandler.ts";
import { sendError, sendSuccess } from "../utils/apiResponse.ts";
import buildFileUrl from "../utils/buildFileUrl.ts";
import { type CreateFoodInput, type UpdateFoodInput } from "../validators/foodValidator.ts";

const createFood = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = req.validatedData as CreateFoodInput;
  const payload = {
    ...validatedData,
    originalInventory: validatedData.originalInventory ?? 0,
    remainingInventory: validatedData.remainingInventory ?? validatedData.originalInventory ?? 0,
    imageUrl: req.file ? buildFileUrl(req, req.file.filename) : validatedData.imageUrl
  };

  const food = await FoodItem.create(payload);

  return sendSuccess(res, 201, "Food item created successfully", food);
});

const getFoods = asyncHandler(async (_req: Request, res: Response) => {
  const foods = await FoodItem.find().sort({ createdAt: -1 });
  const normalizedFoods = foods.map((food) => {
    const legacyInventory = (food as typeof food & { inventory?: number }).inventory;

    return {
      ...food.toObject(),
      originalInventory: food.originalInventory ?? legacyInventory ?? 0,
      remainingInventory: food.remainingInventory ?? food.originalInventory ?? legacyInventory ?? 0
    };
  });

  return sendSuccess(res, 200, "Food items fetched successfully", normalizedFoods);
});

const updateFood = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = req.validatedData as UpdateFoodInput;
  const updates = {
    ...validatedData,
    originalInventory: validatedData.originalInventory ?? 0,
    remainingInventory: validatedData.remainingInventory ?? validatedData.originalInventory ?? 0
  };

  if (req.file) {
    updates.imageUrl = buildFileUrl(req, req.file.filename);
  }

  const food = await FoodItem.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });

  if (!food) {
    return sendError(res, 404, "Food item not found");
  }

  return sendSuccess(res, 200, "Food item updated successfully", food);
});

const deleteFood = asyncHandler(async (req: Request, res: Response) => {
  const food = await FoodItem.findByIdAndDelete(req.params.id);

  if (!food) {
    return sendError(res, 404, "Food item not found");
  }

  return sendSuccess(res, 200, "Food item deleted successfully", {
    id: food._id
  });
});

export {
  createFood,
  getFoods,
  updateFood,
  deleteFood
};
