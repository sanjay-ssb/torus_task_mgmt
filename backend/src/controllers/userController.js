import {User} from "../models/user.model.js";
import {Task} from "../models/task.model.js";
import { ErrorHandler } from "../middlewares/error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import bcrypt from "bcrypt";
 import jwt from "jsonwebtoken";  // JWT import commented out
import { sendToken } from "../utils/jwtToken.js";





export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, role, createdBy } = req.body;
  // const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role || !createdBy) {
    // if (!name || !email || !password || !role ) {
    return next(new ErrorHandler("Please Fill form", 400));
  }
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User Already exist", 400));
  }
  
  user = await User.create({
    name,
    email,
    password,
    role,
    createdBy,
  });
  sendToken("USer Registered Successfully",user,res,200);
});


export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  // Find the user by email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Check if the entered password is correct
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // //JWT Token generation commented out
  // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_TIME,
  // });



  // // Send response without token
  // res.status(200).json({
  //   success: true,
  //   message: "Logged in successfully",
  //   user: {
  //     id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     role: user.role,
  //   },
  //   // token, // This is commented out as token is not being sent
  // });

  sendToken("USer Logged In",user,res,200);
});


export const logout = catchAsyncErrors((req, res, next) => {
  // Remove token from client (usually stored in cookies)
  res
  .status(200)
  .cookie("token", "", {
    expires: new Date(Date.now()), // Set token expiration to current time
    httpOnly: true,
  })
  .json({
    success: true,
    message: "Logged out successfully",
  });
});



export const myProfile = catchAsyncErrors((req, res, next) => {
  const user=req.user;
  res.status(200).json({
    success:true,
    user,
  })
});





// userController.js




// View tasks assigned to the user
export const viewTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedUser: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

// Update their own task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findOneAndUpdate({ _id: id, assignedUser: req.user._id }, req.body, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or you are not the assigned user' });
    }
    res.status(200).json({ message: 'Task updated', updatedTask });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
};

// Delete their own task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, assignedUser: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or you are not the assigned user' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
};

// View user profile
export const viewProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
    res.status(200).json({ message: 'Profile updated', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};
