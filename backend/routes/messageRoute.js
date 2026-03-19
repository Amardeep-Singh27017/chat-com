import express from "express";
import { getMessage, sendMessage } from "../routeControllers/messagerouteController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

const router = express.Router();

// in /send/:id -> In this line, we use id of reciever because send message to reciever.

// send messages 
router.post('/send/:id',isLoggedIn, sendMessage)

// get messages to show on frontend
router.get('/:id',isLoggedIn, getMessage)

export default router;