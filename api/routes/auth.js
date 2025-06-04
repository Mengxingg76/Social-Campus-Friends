import express from "express";
import { login,register,loginout  } from "../controllers/auth.js";

const router = express.Router();

router.post("/login",login);
router.post("/register",register);
router.post("/loginout",loginout);

export default router;
