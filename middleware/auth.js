const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
 // Adjust path if needed

const ensureAuthenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure JWT_SECRET is in your .env
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user; // Attach user data for use in controllers
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token", error: err.message });
    }
};

module.exports = ensureAuthenticated;


// const jwt = require('jsonwebtoken');

// const ensureAuthenticated = (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1];

//     if (!token) {
//         return res.status(403).json({ message: 'Unauthorized, JWT token is required!' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.SECRET_KEY);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         return res.status(403).json({ message: 'Unauthorized! Wrong or expired token.' });
//     }
// };

// module.exports = ensureAuthenticated;

