import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        console.log("[isLoggedIn] Token present:", !!token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not logged in - No token"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("[isLoggedIn] Decoded userId:", decoded?.userId);

        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                success: false,
                message: "User not logged in, Invalid token!"
            });
        }

        const user = await User.findById(decoded.userId).select("-password");
        console.log("[isLoggedIn] User found:", user ? user._id : null);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `error in isLoggedIn middleware, ${error.message}`
        });
    }
}

export default isLoggedIn;