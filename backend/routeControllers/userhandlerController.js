import Conversation from "../models/conversationModel.js";
import User from '../models/userModel.js'


export const getUserBySearch = async (req, res) => {
    try {
        const search = req.query.search || '';
        // const currentUserId = req.user._id || req.user._condition_._id;
        const currentUserId = req.user._id;

        if (!search || search.trim() === "") {
            return res.status(200).json([]);
        }

        const user = await User.find({
            $and: [
                {
                    $or: [
                        { fullname: { $regex: '^' + search, $options: 'i' } },
                        { username: { $regex: '^' + search, $options: 'i' } },
                    ]
                }, {
                    _id: { $ne: currentUserId }  // not shown own id, which is loggined as a current user.
                }
            ]
        }).select("-password -email"); // never send password and email

        res.status(200).send(user)
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }
}

export const getCurrentChatters = async (req, res) => {
    try {
        if (!req.user || !req.user._conditions._id) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized"
            });
        }

        const currentUserID = req.user._conditions._id;
        const currenTChatters = await Conversation.find({
            participants: currentUserID
        }).sort({
            updatedAt: -1
        });

        if (!currenTChatters || currenTChatters.length === 0) return res.status(200).send([]);

        const partcipantsIDS = currenTChatters.reduce((ids, conversation) => {
            const otherParticipents = conversation.participants.filter(id => id !== currentUserID);
            return [...ids, ...otherParticipents]
        }, [])

        const otherParticipentsIDS = partcipantsIDS.filter(id => id.toString() !== currentUserID.toString());

        const user = await User.find({ _id: { $in: otherParticipentsIDS } }).select("-password").select("-email");

        const users = otherParticipentsIDS
            .map(id => user.find(user => user._id.toString() === id.toString()))
            .filter(Boolean); // remove null/undefined entries

        res.status(200).send(users)

    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }
}

