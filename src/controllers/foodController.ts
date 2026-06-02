import { Request, Response } from "express";

import FoodItem from "../models/FoodItem";
import asyncHandler from "../middleware/asyncHandler";
import { sendError, sendSuccess } from "../utils/apiResponse";
import buildFileUrl from "../utils/buildFileUrl";
import { CreateFoodInput, UpdateFoodInput } from "../validators/foodValidator";

const createFood = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = req.validatedData as CreateFoodInput;
  const payload = {
    ...validatedData,
    imageUrl: req.file ? buildFileUrl(req, req.file.filename) : validatedData.imageUrl
  };

  const food = await FoodItem.create(payload);

  return sendSuccess(res, 201, "Food item created successfully", food);
});

const getFoods = asyncHandler(async (_req: Request, res: Response) => {
  const foods = await FoodItem.find().sort({ createdAt: -1 });

  return sendSuccess(res, 200, "Food items fetched successfully", foods);
});

const updateFood = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = req.validatedData as UpdateFoodInput;
  const updates = {
    ...validatedData
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
