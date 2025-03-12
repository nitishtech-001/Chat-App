import express from 'express'
import verifyToken from '../middleware/verifytoken.js';
import { logout, updateProfile, deleteProfile, userAuthCheck } from '../controllers/user.controler.js';

const router = express.Router();

router.post("/logout/:id",verifyToken,logout);
router.post("/update-profile/:id",verifyToken,updateProfile);
router.delete("/delete-profile/:id",verifyToken,deleteProfile);
router.get("/check",verifyToken,userAuthCheck);
export default router;