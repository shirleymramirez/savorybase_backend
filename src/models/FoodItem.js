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
    categories: {
      type: [
        {
          type: String,
          enum: ["Appetizer", "Main Course", "Dessert", "Vegan", "Gluten-Free", "Seasonal", "Chef Special"],
          trim: true
        }
      ],
      required: true,
      validate: {
        validator: (categories) => Array.isArray(categories) && categories.length > 0,
        message: "At least one category is required"
      }
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
