import { Router } from "express";
import {
  addTask,
  deleteTask,
  updateTask,
} from "../controllers/tasks.controller.js";

const router = Router();
router.post("/", addTask);
router.post("/:id", deleteTask);
router.put("/:id", updateTask);

export default router;
