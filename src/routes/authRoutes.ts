import express from "express";

import { loginAdmin } from "../controllers/authController.ts";
import validate from "../middleware/validateRequest.ts";
import { loginSchema } from "../validators/authValidator.ts";

const router = express.Router();

router.post("/login", validate(loginSchema), loginAdmin);

export default router;
