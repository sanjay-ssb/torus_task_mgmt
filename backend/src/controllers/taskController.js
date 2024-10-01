//import  matches  from "validator";
import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import {ErrorHandler, errorMiddleware} from "../middlewares/error.js";
import {Task} from "../models/task.model.js"


// Get tasks assigned to the user
export const getUserTasks = async (req, res) => {
    try {
      const tasks = await Task.find({ assignedUser: req.user._id }).populate('assignedUser createdBy managedBy');
      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching tasks', err });
    }
  };
  
  // Users can update only tasks assigned to them
  export const updateUserTask = async (req, res) => {
    try {
      const task = await Task.findOneAndUpdate({ _id: req.params.id, assignedUser: req.user._id }, req.body, { new: true });
      if (!task) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      res.status(200).json(task);
    } catch (err) {
      res.status(500).json({ message: 'Error updating task', err });
    }
  };
  
  // Users cannot create or delete tasks

  
  export const createTask = catchAsyncErrors(async (req, res, next) => {
    const { title, description, dueDate, status, priority } = req.body;
  
    // Ensure the required fields are provided
    if (!title || !description || !dueDate || !status || !priority) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }
  
    const assignedUser = req.User.email;
    const createdBy = req.User.email;
    const managedBy = req.User.createdBy; // Corrected the typo
  
    // Create the task
    const task = await Task.create({
      title,
      description,
      dueDate,
      status,
      priority,
      assignedUser,
      createdBy,
      managedBy
    });
  
    // Check if the task was created successfully
    if (!task) {
      return next(new ErrorHandler("Task not created", 400));
    }
  
    res.status(201).json({
      success: true,
      task,
      message: "Task created successfully"
    });
  });
  

export const deleteTask=catchAsyncErrors(async(req,res,next)=>{
  const {id}=req.params;
  const task=await Task.findById(id);
   if (!task) {
    return next(new ErrorHandler("Task not found",400))
   }
   await task.deleteOne();

   res.status(200).json({
    success:true,
    message:"Task deleted successfully .."
   })
});

export const UpdateTask=catchAsyncErrors((req,res,next)=>{});
export const getMyTask=catchAsyncErrors((req,res,next)=>{});
export const getSingleTask=catchAsyncErrors((req,res,next)=>{});