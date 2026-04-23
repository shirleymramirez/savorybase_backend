const express = require("express");

const {
  createFood,
  getFoods,
  updateFood,
  deleteFood
} = require("../controllers/foodController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateRequest");
const upload = require("../middleware/uploadMiddleware");
const {
  createFoodSchema,
  updateFoodSchema
} = require("../validators/foodValidator");
const { sendError } = require("../utils/apiResponse");

const router = express.Router();

const ensureCreatePayload = (req, res, next) => {
  if (!req.file && !req.validatedData.imageUrl) {
    return sendError(res, 400, "Provide an image upload or a valid imageUrl");
  }

  return next();
};

const ensureUpdatePayload = (req, res, next) => {
  const hasBodyFields = Object.keys(req.validatedData || {}).length > 0;

  if (!hasBodyFields && !req.file) {
    return sendError(res, 400, "At least one field or image upload is required for update");
  }

  return next();
};

router.get("/", getFoods);

router.post(
  "/",
  protect,
  upload.single("image"),
  validate(createFoodSchema),
  ensureCreatePayload,
  createFood
);
router.put(
  "/:id",
  protect,
  upload.single("image"),
  validate(updateFoodSchema),
  ensureUpdatePayload,
  updateFood
);
router.delete("/:id", protect, deleteFood);

module.exports = router;
