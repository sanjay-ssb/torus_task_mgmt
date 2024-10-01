import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  dueDate: {
    type: Date, 
    required: true,
  },
  status: {
    type: String,
    enum: ['To_Do', 'In_Progress', 'Completed'],
    required: true,
    default: 'To_Do'
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  assignedUser: {
    type: String, // Change to String for email
    required: true
  },
  createdBy: {
    type: String, // Change to String for email
    required: true
  },
  managedBy: {
    type: String, // Change to String for email
    required: true
  }
  
},{timestamps:true});

export const Task = mongoose.model("Task", taskSchema);

