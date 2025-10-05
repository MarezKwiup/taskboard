import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getBoard } from "./board.controller.js";
import { io } from "../index.js";

const prisma = new PrismaClient();

export const addColumn = async (req: Request, res: Response) => {
  console.log("Req : ", req.body);
  const { id, title,columnOrder } = req.body;

  try {
    console.log("Board id is : ", process.env.BOARD_ID);
    const newCol = await prisma.column.create({
      data: {
        id:id,
        title:title,
        boardId: process.env.BOARD_ID,
      },
    });

    await prisma.board.update({
      where: {
        id: process.env.BOARD_ID,
      },
      data: {
        columnOrder: columnOrder
      },
    });

    console.log("Newly created column is : ", newCol);
    const boardData = await getBoard();
    io.emit("boardData", boardData);

    res.status(201).json({ message: "Column created!" });
  } catch (err) {
    const boardData = await getBoard();
    io.emit("boardData", boardData);
    throw new Error("Error while creating a new column!");
  }
};

export const deleteColumn = async (req: Request, res: Response) => {
  const { id: colId } = req.params;
  const {columnOrder}=req.body;

  console.log("Column id to be deleted is : ", colId);
  console.log("Column order is : ",columnOrder);
  try {
    const deletedColumn = await prisma.column.delete({
      where: {
        id: colId,
      },
    });

    const board = await prisma.board.findUnique({
      where: { id: process.env.BOARD_ID },
    });
    if (!board) throw new Error("Board not found");

    await prisma.board.update({
      where: { id: process.env.BOARD_ID },
      data: {
        columnOrder:columnOrder,
      },
    });

    console.log("Deleted columns are : ", deletedColumn);
    const boardData = await getBoard();
    io.emit("boardData", boardData);
    res.status(204).send();
  } catch (err) {
    const boardData = await getBoard();
    io.emit("boardData", boardData);
    throw new Error("Error while deleting column!");
  }
};

export const updateColumn = async (req: Request, res: Response) => {
  const { id, title } = req.body;
  try {
    const updatedColumn = await prisma.column.update({
      where: {
        id,
      },
      data: {
        title,
      },
    });

    console.log("Updated column is : ", updatedColumn);
    const boardData = await getBoard();
    io.emit("boardData", boardData);
    res.status(204).send();
  } catch (err) {
    const boardData = await getBoard();
    io.emit("boardData", boardData);
    throw new Error("Error while updating a column!");
  }
};

export const rearrangeSameColumn = async (req:Request,res:Response)=>{
  const {id,taskIds}=req.body;

  console.log("Column id is : ",id);
  console.log("Task ids are : ",taskIds);
  try{
    const updatedColumn = await prisma.column.update({
      where:{
        id
      },
      data:{
        taskIds:taskIds
      }
    })

    const boardData = await getBoard();
    io.emit("boardData", boardData);

    res.status(200).json({ success: true, updatedColumn });


  }catch(err){
    const boardData = await getBoard();
    io.emit("boardData", boardData);
    throw new Error("Error while rearranging within the same column!")
  }
}

export const rearrangeDifferentColumn = async (req:Request,res:Response)=>{
  const {fromColumnId,toColumnId,fromTaskIds,toTaskIds,taskId}=req.body;

  console.log("From column id is : ",fromColumnId);
  console.log("To column id is : ",toColumnId);
  console.log("From task ids are : ",fromTaskIds);
  console.log("To task ids are : ",toTaskIds);
  console.log("Task id is : ",taskId);
  try{
    const updatedTask= await prisma.task.update({
      where:{
        id:taskId
      },
      data:{
        columnId:toColumnId
      }
    })

    console.log("Updated task : ",updatedTask);

    const updatedFromCol= await prisma.column.update({
      where:{
        id:fromColumnId
      },
      data:{
        taskIds:fromTaskIds
      }
    })

    console.log("Updated from col : ",updatedFromCol);

    const updatedToCol= await prisma.column.update({
      where:{
        id:toColumnId,
      },
      data:{
        taskIds:toTaskIds,
      }
    })

    console.log("Update to col : ",updatedToCol);

    const boardData = await getBoard();
    io.emit("boardData", boardData);

    res.status(200).send();

  }catch(err){  
    const boardData = await getBoard();
    io.emit("boardData", boardData);
    throw new Error("Error while rearranging within the same column!")
  }
}
