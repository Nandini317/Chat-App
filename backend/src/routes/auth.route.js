import express from 'express';
import { checkAuth, login, logout, signup , updateProfile} from '../controllers/auth.controller.js';
const router = express.Router() ; 
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

router.get('/signup' ,signup);
router.get('/login' ,login) ;
router.get("/logout" , logout) ; 
router.route("/update-profile").patch(verifyJWT  , upload.single("avatar"),updateProfile ) ; 
router.route("/check").get(verifyJWT , checkAuth)
export default router ; 
