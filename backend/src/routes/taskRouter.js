import express from "express";
import {
    createTask,
    deleteTask,
    UpdateTask,
    getMyTask,
    getSingleTask
} from "../controllers/taskController.js";
//import { getUserTasks, updateUserTask } from '../controllers/userController.js';
import { roleCheck } from '../middlewares/auth.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router=express.Router();

router.post("/post",isAuthenticated,createTask);
router.delete("/delete/:id",isAuthenticated,deleteTask);
router.put("/update/:id",isAuthenticated,UpdateTask);
router.get("/mytask",isAuthenticated,roleCheck('user'),getMyTask);
router.get("/single/:id",isAuthenticated,roleCheck('user'),getSingleTask);

// User task routes
/* router.get('/tasks',isAuthenticated, roleCheck('user'), getUserTasks);
router.put('/tasks/:id',isAuthenticated, roleCheck('user'), updateUserTask); */


export default router;