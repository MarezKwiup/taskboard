import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getBoard } from "./board.controller.js";
import { io } from "../index.js";

const prisma = new PrismaClient();

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Request body is : ",req.body);
  const {updatedTaskIds} = req.body;

  console.log("Updated task Ids ",updatedTaskIds);
  try {
    const deletedTask = await prisma.task.delete({
      where: {
        id: id,
      },
    });

    console.log("Deleted task is : ", deletedTask);

    const updatedCol = await prisma.column.update({
      where:{
        id:deletedTask.columnId
      },
      data:{
        taskIds:updatedTaskIds
      }
    })

    const boardData = await getBoard();
    
    io.emit("boardData", boardData);
    res.status(204).json({ message: "Task Deleted successfully" });
  } catch (err) {
    const boardData = await getBoard();
    io.emit("boardData", boardData);
    throw new Error("Error while deleting a new task");
  }
};

export const addTask = async (req: Request, res: Response) => {
  console.log("Req body is : ", req.body);
  const { id, title, description, columnId, createdAt, updatedAt,taskId } = req.body;
  try {
    const addedTask = await prisma.task.create({
      data: {
        id,
        title,
        description,
        columnId,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      },
    });

    console.log("Added task is : ", addedTask);

    const updatedCol = await prisma.column.update({
      where:{
        id:columnId,
      },
      data:{
        taskIds:taskId
      }
    })

    console.log("Updated column is : ",updatedCol);

    const boardData = await getBoard();
    io.emit("boardData", boardData);
    res.status(201).json({ message: "task created successfully!" });
  } catch (err) {
    const boardData = await getBoard();
    io.emit("boardData", boardData);
    throw new Error("Error while creating a new task");
  }
};

export const updateTask = async (req: Request, res: Response) => {
  console.log("Req : ", req.body);
  const { id, title, description, updatedAt } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        updatedAt,
      },
    });

    console.log("Updated task is : ", updatedTask);
    const boardData = await getBoard();

    console.log("Board data is : ",boardData);
    io.emit("boardData", boardData);

    res.status(204).send();

  } catch (err) {
    //Server authoritative update
    const boardData = await getBoard();
    io.emit("boardData", boardData);
    throw new Error("Error while updating the task ");
  }
};
