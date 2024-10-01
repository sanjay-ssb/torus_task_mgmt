import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import {errorMiddleware} from "../middlewares/error.js";
import {Task} from "../models/task.model.js"


// Get all tasks (Superadmin can view all tasks)
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedUser createdBy managedBy');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', err });
  }
};

// Create a task (Superadmin can assign any user)
export const createTask = async (req, res) => {
  const { title, description, dueDate, assignedUser, createdBy, managedBy } = req.body;
  
  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      assignedUser,
      createdBy: req.user._id, // Assuming the superadmin is the one creating
      managedBy
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', err });
  }
};

// Delete any task
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', err });
  }
};

// Update any task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', err });
  }
};



//export const createTask=catchAsyncErrors((req,res,next)=>{});
//export const deleteTask=catchAsyncErrors((req,res,next)=>{});
export const UpdateTask=catchAsyncErrors((req,res,next)=>{});
export const getMyTask=catchAsyncErrors((req,res,next)=>{});
export const getSingleTask=catchAsyncErrors((req,res,next)=>{});