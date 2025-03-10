
import express from "express";
import { signup, login, uploadImage} from "../controllers/auth.controller.js";
import upload from "../lib/multer.js";

const router = express.Router();
router.post("/signup",signup);
router.post("/login",login);
router.post("/upload-image",upload.array('images',11) ,uploadImage);
export default router;