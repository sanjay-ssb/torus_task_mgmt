import express from "express";
import {
    login,
    logout,
    myProfile,
    register
} from "../controllers/superadminTaskController.js";
import { getAllTasks, createTask, deleteTask, updateTask } from '../controllers/superadminTaskController.js';
import {isAuthenticated} from "../middlewares/auth.js"
import { roleCheck } from '../middleware/authMiddleware.js'; // Middleware to check for roles 

const router=express.Router();

router.post("/login",login);
router.get("/logout",isAuthenticated,logout);
router.get("/myprofile",isAuthenticated,myProfile);

//Manage All Users and Admins:
router.post("/users",isAuthenticated,register); // Create new users.
router.get("/users",isAuthenticated,register);//View list of users.
router.put("/users/:id",isAuthenticated,register); // edit existing users.
router.delete("/users/:id",isAuthenticated,register); // delete existing users.


//View System Logs:
router.get("/logs",isAuthenticated,logout); //View activity logs

//Admin Management:
router.post("/admin",isAuthenticated,register); // Create new admin.
router.get("/admin",isAuthenticated,register);//View list of admin.
router.put("/admin/:id",isAuthenticated,register); // edit existing admin.
router.delete("/admin/:id",isAuthenticated,register); // delete existing admin.

//tasks
router.get("/tasks",isAuthenticated,roleCheck('superadmin'),logout); //View all tasks.
router.post("/tasks",isAuthenticated,roleCheck('superadmin'),logout);   //Create a new task.
router.put("/tasks/:id",isAuthenticated,roleCheck('superadmin'),logout); // Update task information.
router.delete("/tasks/:id",isAuthenticated,roleCheck('superadmin'),logout); //Delete a task.



export default router;