import {User} from "../models/user.model.js";
import {Task} from "../models/task.model.js";
import { ErrorHandler } from "../middlewares/error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import bcrypt from "bcrypt";
 import jwt from "jsonwebtoken";  // JWT import commented out
import { sendToken } from "../utils/jwtToken.js";





export const createUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, role='user', createdBy='66fb02699a2cb089b235fe56' } = req.body;
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


// superadminController.js


// Create a new user or admin
// export const createUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;
//     const user = new User({ name, email, password, role });
//     await user.save();
//     res.status(201).json({ message: 'User/Admin created successfully', user });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating user/admin', error });
//   }
// };

// List all users and admins
export const listUsers = async (req, res,next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Update user or admin
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: 'User/Admin updated', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user/admin', error });
  }
};

// Delete a user or admin
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User/Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user/admin', error });
  }
};

// View system logs
export const viewLogs = (req, res) => {
  // Example logs handling (In reality, you'd use a logging system)
  const logs = [
    { event: 'User created', time: new Date() },
    { event: 'Task deleted', time: new Date() }
  ];
  res.status(200).json(logs);
};
