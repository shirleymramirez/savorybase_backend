const { z } = require("zod");

const categories = ["Appetizer", "Main Course", "Dessert", "Vegan", "Gluten-Free", "Seasonal", "Chef Special"];
const categoryMessage = "Categories must include only Appetizer, Main Course, Dessert, Vegan, Gluten-Free, Seasonal, Chef Special";

const normalizeCategories = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);

    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (_error) {
    // Fall back to comma-separated form field values.
  }

  return trimmed.split(",").map((category) => category.trim());
};

const categoriesSchema = z.preprocess(
  normalizeCategories,
  z.array(
    z.enum(categories, {
      errorMap: () => ({
        message: categoryMessage
      })
    })
  ).min(1, "At least one category is required")
);

const baseFoodSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  price: z.coerce.number().nonnegative("Price must be 0 or greater"),
  categories: categoriesSchema,
  imageUrl: z.string().trim().url("Image URL must be a valid URL").optional()
});

const createFoodSchema = baseFoodSchema;

const updateFoodSchema = baseFoodSchema.partial();

module.exports = {
  createFoodSchema,
  updateFoodSchema
};
