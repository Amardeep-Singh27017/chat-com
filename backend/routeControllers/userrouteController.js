import User from "../models/userModel.js";
import bcryptjs from "bcryptjs"
import jwtToken from "../utils/jwtwebToken.js";

// userRegister feature 

export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, gender, password, profilepic } = req.body
        const user = await User.findOne({ email, username })
        if (user) {
            return res.status(500).send({ success: false, message: "Username or email alredy exist!" })
        }
        // password hased 
        const hashPassword = bcryptjs.hashSync(password, 10)

        // now storing in db 
        const newUser = User({
            fullname,
            username,
            email,
            gender,
            password: hashPassword,
            profilepic
        })
        if (newUser) {
            await newUser.save();
            jwtToken(newUser._id, res) // for jwt token generation we send the user id and response.
        } else {
            res.status(500).send({ success: false, message: "Invalid user data!" })
        }

        // after save new user, send data to frontend, not need to send password to frontend. 
        res.status(201).send({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            gender: newUser.gender,
            profilepic: newUser.profilepic,
            email: newUser.email
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error)
    }
}

// userLogin feature 

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(500).send({ success: false, message: "Username or email does't exist!" })
        }
        const comparePassword = bcryptjs.compareSync(password, user.password || "")
        if (!comparePassword) {
            return res.status(500).send({ success: false, message: "Invalid password!" })
        }
        jwtToken(user._id, res)
        res.status(201).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            gender: user.gender,
            profilepic: user.profilepic,
            email: user.email,
            message: "Login successful!"
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error)
    }
}

// userLogout feature 

export const userLogout = async (req, res) => {
    try {
        res.cookie("jwt", '', {
            maxAge: 0,
        })
        res.status(200).send({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }
}