const mongoose = require("mongoose");

const modifierItemSchema = new mongoose.Schema(
  {
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
    active: {
      type: Boolean,
      required: true,
      default: true
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

modifierItemSchema.virtual("id").get(function getId() {
  return this._id.toString();
});

modifierItemSchema.set("toJSON", { virtuals: true });
modifierItemSchema.set("toObject", { virtuals: true });

modifierItemSchema.index({ name: 1 });

module.exports = mongoose.model("ModifierItem", modifierItemSchema);
