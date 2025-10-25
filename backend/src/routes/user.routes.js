import {Router} from 'express';
import {
    getProfile,
     login,
     logout,
     register
} from "../controllers/user.controller.js"
import {protect} from '../middleware/auth.js'


const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile",protect, getProfile);
router.post("/logout", logout);

export default router;