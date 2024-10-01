import express from "express";
import {
    login,
    logout,
    myProfile,
    register
} from "../controllers/adminTaskController.js";
import {isAuthenticated} from "../middlewares/auth.js" 
import {roleCheck} from "../middlewares/auth.js" 
import { getAdminTasks, createTask, updateTask } from '../controllers/adminTaskController.js';
const router=express.Router();

router.post("/login",login);
router.get("/logout",isAuthenticated,logout);
router.get("/myprofile",isAuthenticated,myProfile);
router.post("/register",register);

//manage Users only
router.post("/users",isAuthenticated,register); // Create new users.
router.get("/users",isAuthenticated,register);//View list of users.
router.put("/users/:id",isAuthenticated,register); // edit existing users.
router.delete("/users/:id",isAuthenticated,register); // delete existing users.

// Admin task routes
router.get("/tasks",isAuthenticated, roleCheck('admin'),getAdminTasks); //View all tasks.
router.post("/tasks",isAuthenticated,roleCheck('admin'),createTask);   //Create a new task.
router.put("/tasks/:id",isAuthenticated,roleCheck('admin'),updateTask); // Update task information.
router.delete("/tasks/:id",isAuthenticated,roleCheck('admin'),deleteTask); //Delete a task.



//View System Logs:
router.get("/logs",isAuthenticated,logout); //View activity logs

export default router;