import {ErrorHandler} from "./error.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";

export const isAuthenticated=catchAsyncErrors(async (req,res,next) => {
    const {token}=req.cookies;
    if (!token) {
        return next(new ErrorHandler("User is not authenticated",400));
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.User=await User.findById(decoded.id);
    next();
})

export const roleCheck = (requiredRole) => {
    return (req, res, next) => {
      const userRole = req.user.role; // Assuming user role is attached to the request object after authentication
  
      if (requiredRole === 'superadmin' && userRole === 'superadmin') {
        return next();
      } else if (requiredRole === 'admin' && (userRole === 'admin' || userRole === 'superadmin')) {
        return next();
      } else if (requiredRole === 'user' && (userRole === 'user' || userRole === 'admin' || userRole === 'superadmin')) {
        return next();
      }
  
      return res.status(403).json({ message: 'Access denied' });
    };
  };