import {Router} from 'express';
import {getBoard} from '../controllers/board.controller.js';


const router = Router();

router.get('/',getBoard)

export default router;