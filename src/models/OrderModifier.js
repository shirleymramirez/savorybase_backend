const mongoose = require("mongoose");

const orderModifierSchema = new mongoose.Schema(
  {
    order_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
      index: true
    },
    modifier_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ModifierItem",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    price_adjustment: {
      type: Number,
      required: true,
      default: 0
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

orderModifierSchema.virtual("id").get(function getId() {
  return this._id.toString();
});

orderModifierSchema.set("toJSON", { virtuals: true });
orderModifierSchema.set("toObject", { virtuals: true });

orderModifierSchema.index(
  {
    order_item_id: 1,
    modifier_item_id: 1
  },
  {
    unique: true
  }
);

module.exports = mongoose.model("OrderModifier", orderModifierSchema);
