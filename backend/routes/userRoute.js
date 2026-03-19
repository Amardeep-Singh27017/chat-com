import express from "express"
import isLoggedIn from "../middlewares/isLoggedIn.js";
import { getCurrentChatters, getUserBySearch } from "../routeControllers/userhandlerController.js";

const router = express.Router();

router.get('/search', isLoggedIn, getUserBySearch)

router.get('/currentChatters', isLoggedIn, getCurrentChatters)


export default router