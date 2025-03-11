import express from 'express';
import { sendMessage,getUserForSideBar, getMessages } from '../controllers/message.controller.js';
import verifyToken from '../middleware/verifytoken.js';

const router = express.Router();

router.get("/users",verifyToken,getUserForSideBar);
router.get("/:id",verifyToken,getMessages);
router.post("/send/:id",verifyToken,sendMessage);
export default router;