const jwt = require('jsonwebtoken');
const User = require('../models/User');


const auth = async (req, res, next) => {

    // try {
        const headers = req.headers.authorization;
        
        if (!headers || !headers.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = headers.split(' ')[1];

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(payload.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = { id: user._id, email: user.email, name: user.name };
        next();
    // } catch (error) {
    //     return res.status(401).json({ message: "Invalid token", error : error.message})
    // }
}

module.exports = auth;