import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import type { Column, Task } from "../types.js";

const prisma = new PrismaClient();

export const getBoard = async () => {
  let board;
  board = await prisma.board.findFirst({
    include: {
      columns: {
        include: {
          tasks: true,
        },
      },
    },
  });
  if (!board) {
    board = await prisma.board.create({
      data: {
        columnOrder: [],
        title:'My board'
      },
      include: {
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });
    console.log("No existing board found — created a new empty board.");
  }

  let columns: Record<string, Column> = {};
  let tasks: Record<string, Task> = {};
  for (let col of board.columns) {
    let { id, title, tasks: colTasks, taskIds } = col;

    for (let task of colTasks) {
      let {
        id: taskId,
        title: taskTitle,
        description,
        createdAt,
        updatedAt,
      } = task;
      tasks[taskId] = {
        id: taskId,
        title: taskTitle,
        createdAt: new Date(createdAt).toISOString(),
        updatedAt: new Date(updatedAt).toISOString(),
        description: description ? description : undefined,
      };
    }

    columns[id] = {
      id: id,
      title: title,
      taskIds: taskIds,
    };
  }

  const boardData = { columnOrder: board.columnOrder, tasks, columns };

  console.log("Board data : ", boardData);

  return { columnOrder: board.columnOrder, tasks, columns };
};
