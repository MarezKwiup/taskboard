import { Router } from "express";
import { addTask, deleteTask, updateTask } from "../controllers/tasks.controller.js";

const router=Router();

router.delete('/:id',deleteTask);
router.post('/',addTask);
router.put("/:id",updateTask)

export default router;