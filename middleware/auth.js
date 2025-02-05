import prisma from "../prisma/client.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            return res.status(403).json({ error: "Access Denied" });
        }

        const verify = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verify;
        
        const userId = req.user.id;       

        next();
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
           message: `Something went wrong, Error: ${error.message}`
        })
    }
};