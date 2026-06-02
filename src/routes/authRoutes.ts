import express from "express";

import { loginAdmin } from "../controllers/authController";
import validate from "../middleware/validateRequest";
import { loginSchema } from "../validators/authValidator";

const router = express.Router();

router.post("/login", validate(loginSchema), loginAdmin);

export default router;
