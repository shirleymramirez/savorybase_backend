import mongoose from "mongoose";

const refreshOrderFrequencyStats = () => {
  import("../services/orderFrequencyStatsService.ts").then(({ refreshOrderFrequencyStats: refresh }) => {
    refresh().catch((error: Error) => {
      console.error("Order frequency stats refresh failed:", error.message);
    });
  }).catch((error: Error) => {
    console.error("Order frequency stats refresh failed:", error.message);
  });
};

const orderItemSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true
    },
    food_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodItem",
      required: true,
      index: true
    },
    name_at_time_of_order: {
      type: String,
      required: true,
      trim: true
    },
    description_at_time_of_order: {
      type: String,
      required: true,
      trim: true
    },
    price_at_time_of_order: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    canceled_at: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
);

orderItemSchema.virtual("id").get(function getId() {
  return this._id.toString();
});

orderItemSchema.virtual("line_total").get(function getLineTotal() {
  return this.price_at_time_of_order * this.quantity;
});

orderItemSchema.set("toJSON", { virtuals: true });
orderItemSchema.set("toObject", { virtuals: true });

orderItemSchema.index({ food_item_id: 1, created_at: 1 });
orderItemSchema.index({ order_id: 1, food_item_id: 1 });

orderItemSchema.post("save", refreshOrderFrequencyStats);
orderItemSchema.post("findOneAndUpdate", refreshOrderFrequencyStats);
orderItemSchema.post("findOneAndDelete", refreshOrderFrequencyStats);

export default mongoose.model("OrderItem", orderItemSchema);
