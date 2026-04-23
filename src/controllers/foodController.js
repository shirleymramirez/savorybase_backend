const FoodItem = require("../models/FoodItem");
const asyncHandler = require("../middleware/asyncHandler");
const { sendError, sendSuccess } = require("../utils/apiResponse");
const buildFileUrl = require("../utils/buildFileUrl");

const createFood = asyncHandler(async (req, res) => {
  const payload = {
    ...req.validatedData,
    imageUrl: req.file ? buildFileUrl(req, req.file.filename) : req.validatedData.imageUrl
  };

  const food = await FoodItem.create(payload);

  return sendSuccess(res, 201, "Food item created successfully", food);
});

const getFoods = asyncHandler(async (_req, res) => {
  const foods = await FoodItem.find().sort({ createdAt: -1 });

  return sendSuccess(res, 200, "Food items fetched successfully", foods);
});

const updateFood = asyncHandler(async (req, res) => {
  const updates = {
    ...req.validatedData
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

const deleteFood = asyncHandler(async (req, res) => {
  const food = await FoodItem.findByIdAndDelete(req.params.id);

  if (!food) {
    return sendError(res, 404, "Food item not found");
  }

  return sendSuccess(res, 200, "Food item deleted successfully", {
    id: food._id
  });
});

module.exports = {
  createFood,
  getFoods,
  updateFood,
  deleteFood
};
