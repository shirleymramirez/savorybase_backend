const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      enum: ["Appetizer", "Main Course", "Dessert", "Vegan", "Gluten-Free", "Seasonal", "Chef Special"],
      required: true
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("FoodItem", foodItemSchema);
