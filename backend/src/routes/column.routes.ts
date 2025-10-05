import { Router } from "express";
import { addColumn, deleteColumn, rearrangeSameColumn, updateColumn,rearrangeDifferentColumn } from "../controllers/column.controller.js";

const router = Router();

router.post('/',addColumn);
router.post('/rearrange-sc',rearrangeSameColumn);
router.post('/rearrange-dc',rearrangeDifferentColumn)
router.put('/',updateColumn)
router.post('/:id',deleteColumn)
export default router;