import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import type { Column, Task } from "../types.js";

const prisma = new PrismaClient();

export const getBoard = async () => {
  const board = await prisma.board.findFirst({
    include: {
      columns: {
        include: {
          tasks: true,
        },
      },
    },
  });
  if (!board) return null;

  let columns: Record<string, Column> = {};
  let tasks: Record<string, Task> = {};
  for (let col of board.columns) {
    let { id, title, tasks: colTasks } = col;
    let taskIds: string[] = [];

    for (let task of colTasks) {
      let {id: taskId,title: taskTitle,description,createdAt,updatedAt} = task;
      taskIds.push(taskId);
      tasks[taskId] = {
        id: taskId,
        title: taskTitle,
        createdAt: new Date(createdAt).toISOString(),
        updatedAt: new Date(updatedAt).toISOString(),
        description: description ? description : undefined,
      };
    }

    columns[id]={
        id:id,
        title:title,
        taskIds:taskIds
    }
  }

  return { columnOrder: board.columnOrder,tasks,columns };
};
