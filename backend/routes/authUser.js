import express from "express";
import { userLogin, userLogout, userRegister } from "../routeControllers/userrouteController.js";
import upload from "../middlewares/upload.js";
import { uploadProfilePic } from "../routeControllers/user.pro.uploadController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

const router = express.Router()

router.post("/register", userRegister)
router.post("/login", userLogin)
router.post("/logout", userLogout)

router.post("/upload-profile", isLoggedIn, upload.single("profile"), uploadProfilePic);


export default router;