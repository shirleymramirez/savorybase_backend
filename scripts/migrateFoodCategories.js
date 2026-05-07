const mongoose = require("mongoose");

const connectDB = require("../src/config/db");
const FoodItem = require("../src/models/FoodItem");

const allowedCategories = new Set([
  "Appetizer",
  "Main Course",
  "Dessert",
  "Vegan",
  "Gluten-Free",
  "Seasonal",
  "Chef Special"
]);

const categoryAliases = {
  Main: "Main Course"
};

const normalizeCategory = (category) => {
  if (typeof category !== "string") {
    return null;
  }

  const trimmed = category.trim();

  return categoryAliases[trimmed] || trimmed;
};

const migrateFoodCategories = async () => {
  await connectDB();

  const collection = FoodItem.collection;
  const foodsWithCategory = await collection
    .find({ category: { $exists: true } })
    .project({ _id: 1, category: 1, categories: 1 })
    .toArray();

  if (foodsWithCategory.length === 0) {
    console.log("No food category fields found to migrate.");
    return;
  }

  const operations = [];
  const invalidFoods = [];

  for (const food of foodsWithCategory) {
    const hasCategories = Array.isArray(food.categories) && food.categories.length > 0;

    if (hasCategories) {
      operations.push({
        updateOne: {
          filter: { _id: food._id },
          update: { $unset: { category: "" } }
        }
      });
      continue;
    }

    const category = normalizeCategory(food.category);

    if (!allowedCategories.has(category)) {
      invalidFoods.push({
        id: food._id.toString(),
        category: food.category
      });
      continue;
    }

    operations.push({
      updateOne: {
        filter: { _id: food._id },
        update: {
          $set: { categories: [category] },
          $unset: { category: "" }
        }
      }
    });
  }

  if (invalidFoods.length > 0) {
    console.error("Migration stopped. These foods have invalid category values:");
    for (const food of invalidFoods) {
      console.error(`- ${food.id}: ${JSON.stringify(food.category)}`);
    }
    process.exitCode = 1;
    return;
  }

  if (operations.length === 0) {
    console.log("No valid food category fields found to migrate.");
    return;
  }

  const result = await collection.bulkWrite(operations, { ordered: false });

  console.log(`Matched ${result.matchedCount} food items.`);
  console.log(`Modified ${result.modifiedCount} food items.`);
  console.log("Food categories migration completed.");
};

migrateFoodCategories()
  .catch((error) => {
    console.error("Food categories migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
