import express from "express"
import { Router } from "express"
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {searchUser} from "../controllers/user.controller.js"

const router = Router() ; 

router.route("/search").get(verifyJWT , searchUser) ; 

export default router ; 
