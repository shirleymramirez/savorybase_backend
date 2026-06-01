const mongoose = require("mongoose");

const orderFrequencyStatSchema = new mongoose.Schema(
  {
    period: {
      type: String,
      enum: ["daily", "weekly"],
      required: true
    },
    period_start: {
      type: Date,
      required: true
    },
    food_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodItem",
      required: true
    },
    order_count: {
      type: Number,
      required: true,
      min: 0
    },
    item_quantity: {
      type: Number,
      required: true,
      min: 0
    },
    gross_revenue: {
      type: Number,
      required: true,
      min: 0
    },
    refreshed_at: {
      type: Date,
      required: true
    }
  },
  {
    collection: "order_frequency_stats",
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
);

orderFrequencyStatSchema.index(
  {
    period: 1,
    period_start: 1,
    food_item_id: 1
  },
  {
    unique: true
  }
);

module.exports = mongoose.model("OrderFrequencyStat", orderFrequencyStatSchema);
