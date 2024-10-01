import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import {errorMiddleware} from "../middlewares/error.js";
import {Task} from "../models/task.model.js"


// Get tasks managed by the admin or assigned to users under their supervision
export const getAdminTasks = async (req, res) => {
    try {
      const tasks = await Task.find({ managedBy: req.user._id }).populate('assignedUser createdBy managedBy');
      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching tasks', err });
    }
  };
  
  // Create a new task (admin can assign to users under them)
  export const createTask = async (req, res) => {
    const { title, description, dueDate, assignedUser } = req.body;
    
    try {
      const newTask = new Task({
        title,
        description,
        dueDate,
        assignedUser,
        createdBy: req.user._id, // Admin creating the task
        managedBy: req.user._id   // Admin managing the task
      });
  
      await newTask.save();
      res.status(201).json(newTask);
    } catch (err) {
      res.status(500).json({ message: 'Error creating task', err });
    }
  };
  
  // Admin can only update tasks they manage
  export const updateTask = async (req, res) => {
    try {
      const task = await Task.findOneAndUpdate({ _id: req.params.id, managedBy: req.user._id }, req.body, { new: true });
      if (!task) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      res.status(200).json(task);
    } catch (err) {
      res.status(500).json({ message: 'Error updating task', err });
    }
  };
  
  // Admin cannot delete tasks created by the superadmin


//export const createTask=catchAsyncErrors((req,res,next)=>{});
export const deleteTask=catchAsyncErrors((req,res,next)=>{});
export const UpdateTask=catchAsyncErrors((req,res,next)=>{});
export const getMyTask=catchAsyncErrors((req,res,next)=>{});
export const getSingleTask=catchAsyncErrors((req,res,next)=>{});