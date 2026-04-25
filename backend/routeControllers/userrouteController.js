import User from "../models/userModel.js";
import bcryptjs from "bcryptjs"
import jwtToken from "../utils/jwtwebToken.js";

// userRegister feature 
export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, gender, password, profilepic } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "Username or email already exists!",
            });
        }

        const hashPassword = bcryptjs.hashSync(password, 10);

        const newUser = new User({
            fullname,
            username,
            email,
            gender,
            password: hashPassword,
            profilepic,
        });

        await newUser.save();

        jwtToken(newUser._id, res);

        res.status(201).send({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            gender: newUser.gender,
            profilepic: newUser.profilepic,
            email: newUser.email,
        });

    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];

            return res.status(400).send({
                success: false,
                message: `${field} already exists`,
            });
        }

        res.status(500).send({
            success: false,
            message: "Something went wrong",
        });
    }
};

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