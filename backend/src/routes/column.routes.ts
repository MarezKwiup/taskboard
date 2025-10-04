import { Router } from "express";
import { addColumn, deleteColumn, updateColumn } from "../controllers/column.controller.js";

const router = Router();

router.post('/',addColumn);
router.delete('/:id',deleteColumn)
router.put('/',updateColumn)

export default router;