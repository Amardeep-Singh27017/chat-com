import Conversation from "../models/conversationModel.js";
import Message from "../models/messagesModel.js";
import { getReciverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: recieverId } = req.params;
        const senderId = req.user?._id;

        if (!senderId || !recieverId) {
            return res.status(400).json({
                success: false,
                message: "Sender or receiver ID missing"
            });
        }

        // check participants alreday have a conversation cluster or not, if have then add messages inside cluster.
        let chats = await Conversation.findOne({
            participants: { $all: [senderId, recieverId] }
        })

        // if not then create new one with sender and reciever id's 
        if (!chats) {
            chats = await Conversation.create({
                participants: [senderId, recieverId],
            })
        }

        // create messages
        const newMessages = new Message({
            senderId,
            recieverId,
            message: message,
            conversationId: chats._id
        })

        // add id of newMessages into the conversation cluster's message array 
        if (newMessages) {
            chats.messages.push(newMessages._id)
        }

        // save the chats and newMessages to db 

        await chats.save()
        await newMessages.save()

        // SHOKET IO function 
        const recevierSocketId = getReciverSocketId(recieverId)
        if (recevierSocketId) {
            io.to(recevierSocketId).emit("newMessage", newMessages)
        }
        // ------

        res.status(201).send(newMessages)

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error.message}`
        });
    }
}

export const getMessage = async (req, res) => {
    try {
        const { id: recieverId } = req.params;
        const senderId = req.user?._id;

        if (!senderId || !recieverId) {
            return res.status(400).json({
                success: false,
                message: "Sender or receiver ID missing"
            });
        }

        const chats = await Conversation.findOne({
            participants: { $all: [senderId, recieverId] }
        }).populate("messages");

        if (!chats) {
            return res.status(200).send([])
        }

        const message = chats.messages;
        res.status(200).send(message)

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error.message}`
        });
    }
}