import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ message: "No token" });
    console.log("token by varifyJWT:", token);
    
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decodedToken : ", decoded);
    

    const user = await User.findById(decoded._id);

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default verifyJWT