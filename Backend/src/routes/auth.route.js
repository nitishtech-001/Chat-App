
import express from "express";
import { signup, login} from "../controllers/auth.controller.js";
import { logout, updateProfile } from "../controllers/user.controler.js";
import verifyToken from "../middleware/verifytoken.js";

const router = express.Router();
router.post("/signup",signup);

router.post("/login",login);

export default router;