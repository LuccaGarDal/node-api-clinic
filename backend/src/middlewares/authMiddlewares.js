import {prisma} from '../config/db.js';
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt){
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user) {
            return res.status(401).json({ error: 'Not authorized, user not found' });
        }

        req.user = user;
        next();
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Not authorized, token failed' });
    }


}

export const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.cargo !== role) {
            return res.status(403).json({ error: "You are not authorized to access this resource" });
        }
        next();
    };
};