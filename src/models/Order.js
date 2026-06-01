const mongoose = require("mongoose");

const orderStatuses = ["pending", "preparing", "delivered", "canceled"];

const refreshOrderFrequencyStats = () => {
  const { refreshOrderFrequencyStats: refresh } = require("../services/orderFrequencyStatsService");

  refresh().catch((error) => {
    console.error("Order frequency stats refresh failed:", error.message);
  });
};

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: orderStatuses,
      required: true,
      default: "pending",
      index: true
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

orderSchema.virtual("id").get(function getId() {
  return this._id.toString();
});

orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

orderSchema.index({ created_at: 1 });

orderSchema.pre("save", function setCanceledAt(next) {
  if (this.isModified("status")) {
    this.canceled_at = this.status === "canceled" ? this.canceled_at || new Date() : null;
  }

  next();
});

orderSchema.pre("findOneAndUpdate", function setCanceledAtForUpdate(next) {
  const update = this.getUpdate() || {};
  const status = update.status || (update.$set && update.$set.status);

  if (status === "canceled") {
    this.set({
      canceled_at: update.canceled_at || (update.$set && update.$set.canceled_at) || new Date()
    });
  }

  if (status && status !== "canceled") {
    this.set({
      canceled_at: null
    });
  }

  next();
});

orderSchema.post("save", refreshOrderFrequencyStats);
orderSchema.post("findOneAndUpdate", refreshOrderFrequencyStats);
orderSchema.post("findOneAndDelete", refreshOrderFrequencyStats);

module.exports = mongoose.model("Order", orderSchema);
module.exports.orderStatuses = orderStatuses;
