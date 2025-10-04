import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getBoard } from "./board.controller.js";
import { io } from "../index.js";

const prisma = new PrismaClient();

export const addColumn = async (req: Request, res: Response) => {
  console.log("Req : ", req.body);
  const { id, title } = req.body;
  try {
    console.log("Board id is : ", process.env.BOARD_ID);
    const newCol = await prisma.column.create({
      data: {
        id,
        title,
        boardId: process.env.BOARD_ID,
      },
    });

    await prisma.board.update({
      where: {
        id: process.env.BOARD_ID,
      },
      data: {
        columnOrder: {
          push: newCol.id,
        },
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

  console.log("Column id to be deleted is : ", colId);
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
        columnOrder: {
          set: board.columnOrder.filter((id) => id !== colId),
        },
      },
    });

    console.log("Deleted columns are : ", deletedColumn);
    const boardData = await getBoard();
    io.emit("boardData", boardData);
    res.status(204);
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
    res.status(204);
  } catch (err) {
    const boardData = await getBoard();
    io.emit("boardData", boardData);
    throw new Error("Error while updating a column!");
  }
};
