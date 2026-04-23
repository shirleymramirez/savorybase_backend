const express = require("express");

const { loginAdmin } = require("../controllers/authController");
const validate = require("../middleware/validateRequest");
const { loginSchema } = require("../validators/authValidator");

const router = express.Router();

router.post("/login", validate(loginSchema), loginAdmin);

module.exports = router;
