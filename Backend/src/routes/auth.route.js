
import express from "express";
import { signup, login, googleLogin, uploadFiles} from "../controllers/auth.controller.js";
import upload from "../lib/multer.js";

const router = express.Router();
router.post("/signup",signup);
router.post("/login",login);
router.post("/googleLogin",googleLogin);
router.post("/upload-file",upload.array('file',11) ,uploadFiles);
export default router;