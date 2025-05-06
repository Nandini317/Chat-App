import express from 'express';
import { login, logout, signup , updateProfile} from '../controllers/auth.controller.js';
const router = express.Router() ; 
import { verifyJWT } from '../middlewares/auth.middleware.js';

router.get('/signup' ,signup);
router.get('/login' ,login) ;
router.get("/logout" , logout) ; 
router.put("/update-profile",verifyJWT ,updateProfile ) ; 

export default router ; 
