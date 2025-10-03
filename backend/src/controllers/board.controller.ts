import type {Request,Response} from 'express';
import { mockData } from '../mockData.js';

export const getBoard = async (req:Request,res:Response)=>{
    return res.json(mockData);
}
