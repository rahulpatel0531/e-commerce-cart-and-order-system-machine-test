const jwt = require("jsonwebtoken");
const User = require("../models/User");


exports.register = async (req, res, next) => {
    try {
        console.log('body', req.body);
        
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ mesage: "All fields are required" })
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ mesage: "Email already exists" })
        }

        const user = await User.create({
            name, email, password
        });

        return res.status(201).json({ mesage: "User registered", user: { id: user._id, email: user.email, name: user.name } })
    } catch (err) {
        next(err)
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ mesage: "All fields are required" })
        }

        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            return res.status(400).json({ mesage: "Invalid credentials" })
        }
        const checkPassword = await user.comparePassword(password);
        if (!checkPassword) {
            return res.status(400).json({ mesage: "Invalid credentials" })
        }
        const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET_KEY, {  expiresIn:process.env.JWT_EXPIRES_IN });

        return res.status(201).json({ mesage: "User registered", user: { id: user._id, email: user.email, name: user.name }, token })

    } catch (err) {
        next(err)
    }
}

