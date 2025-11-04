
import express from "express";
import { register, login } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/me", authMiddleware, (req, res) => {
  res.json({ message: "Authenticated route", user: req.user });
});

export default router;
