import express from 'express'
import verifyToken from '../middleware/verifytoken.js';
import { logout, updateProfile } from '../controllers/user.controler.js';

const router = express.Router();

router.post("/logout/:id",verifyToken,logout);
router.post("/update-profile/:id",verifyToken,updateProfile);

export default router;