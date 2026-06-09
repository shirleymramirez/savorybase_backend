import { z } from "zod";

const categories = ["Appetizer", "Main Course", "Dessert", "Vegan", "Gluten-Free", "Seasonal", "Chef Special"] as const;
const categoryMessage = "Categories must include only Appetizer, Main Course, Dessert, Vegan, Gluten-Free, Seasonal, Chef Special";

const normalizeCategories = (value: unknown): unknown => {
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
  originalInventory: z.coerce.number().int("Original inventory must be a whole number").nonnegative("Original inventory must be 0 or greater").default(0),
  remainingInventory: z.coerce.number().int("Remaining inventory must be a whole number").nonnegative("Remaining inventory must be 0 or greater").default(0),
  active: z.coerce.boolean().optional(),
  imageUrl: z.string().trim().url("Image URL must be a valid URL").optional()
});

const createFoodSchema = baseFoodSchema;

const updateFoodSchema = baseFoodSchema.partial();

type CreateFoodInput = z.infer<typeof createFoodSchema>;
type UpdateFoodInput = z.infer<typeof updateFoodSchema>;

export {
  createFoodSchema,
  updateFoodSchema
};
export type {
  CreateFoodInput,
  UpdateFoodInput
};
