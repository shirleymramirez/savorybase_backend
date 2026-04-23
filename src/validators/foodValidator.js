const { z } = require("zod");

const categories = ["Appetizer", "Main Course", "Dessert", "Vegan", "Gluten-Free", "Seasonal", "Chef Special"];

const baseFoodSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  price: z.coerce.number().nonnegative("Price must be 0 or greater"),
  category: z.enum(categories, {
    errorMap: () => ({
      message: "Category must be one of Appetizer, Main Course, Dessert, Vegan, Gluten-Free, Seasonal, Chef Special"
    })
  }),
  imageUrl: z.string().trim().url("Image URL must be a valid URL").optional()
});

const createFoodSchema = baseFoodSchema;

const updateFoodSchema = baseFoodSchema.partial();

module.exports = {
  createFoodSchema,
  updateFoodSchema
};
