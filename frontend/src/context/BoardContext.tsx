import React, { useState, useEffect, useContext, createContext } from "react";
import { type BoardData, type Task, type Column } from "../types/board";
import { initialData } from "../data/mockData";
import socket from "../socket";
import { type SetStateAction, type Dispatch } from "react";
import axios from "axios";
type BoardContextType = {
  boardData: BoardData;
  online: boolean;
  setBoardData: Dispatch<SetStateAction<BoardData>>;
  addTask: (columnId: string, task: Task) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addColumn: (column: Column) => void;
  updateColumn: (columnId: string, updatedColumn: Partial<Column>) => void;
  rearrangeColumns: (newOrder: string[]) => void;
  deleteColumn: (columnId: string) => void;
};

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [online, setOnline] = useState<boolean>(navigator.onLine);
  const [boardData, setBoardData] = useState<BoardData>(initialData);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    socket.on("boardData", (data: BoardData) => {
      console.log("Board data from the backend is : ", boardData);
      setBoardData(data);
    });

    socket.on("connect", () => console.log("Connected to socket server"));
    socket.on("disconnect", () =>
      console.log("Disconnected from socket server")
    );

    return () => {
      socket.off("boardData");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const addTask = async (columnId: string, task: Task) => {
    setBoardData((prev) => {
      const newTasks = {
        ...prev.tasks,
        [task.id]: task,
      };

      const column = prev.columns[columnId];
      const updatedColumn: Column = {
        ...column,
        taskIds: [...column.taskIds, task.id],
      };

      return {
        ...prev,
        tasks: newTasks,
        columns: {
          ...prev.columns,
          [columnId]: updatedColumn,
        },
      };
    });

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/tasks/`,
      {
        id: task.id,
        title: task.title,
        description: task.description,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        columnId: columnId,
      }
    );

    console.log("Response from the backend is : ", res);
  };

  const updateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    const newTask = {
      ...boardData.tasks[taskId],
      ...updatedTask,
      updatedAt: new Date().toISOString(),
    };

    //optimistic update
    setBoardData((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: newTask,
      },
    }));

    const res = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${taskId}`,
      {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        updatedAt: newTask.updatedAt,
      }
    );

    console.log("Response after deletion is : ", res);
  };

  const deleteTask = async (taskId: string) => {
    setBoardData((prev) => {
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];

      const newColumns = Object.fromEntries(
        Object.entries(prev.columns).map(([colId, col]) => [
          colId,
          { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) },
        ])
      );

      return {
        ...prev,
        tasks: newTasks,
        columns: newColumns,
      };
    });
    console.log("Backend url is : ", import.meta.env.VITE_BACKEND_URL);
    const res = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${taskId}`
    );

    console.log("Response after deletion is : ", res);
  };

  //Column methods
  const addColumn = async (column: Column) => {
    setBoardData((prev) => ({
      ...prev,
      columns: { ...prev.columns, [column.id]: column },
      columnOrder: [...prev.columnOrder, column.id],
    }));

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/column/`,
      {
        id: column.id,
        title: column.title,
      }
    );

    console.log("Response from the backend is : ", res);
  };

  const updateColumn = async (columnId: string, updatedColumn: Partial<Column>) => {

    const newColumn={
      ...boardData.columns[columnId],
      ...updatedColumn
    }
    setBoardData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: newColumn,
      },
    }));

    const res = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/column/`,
      {
        id: newColumn.id,
        title: newColumn.title,
      }
    );

    console.log("Response from the backend is : ",res);


  };

  const rearrangeColumns = (newOrder: string[]) => {
    setBoardData((prev) => ({
      ...prev,
      columnOrder: newOrder,
    }));
  };

  const deleteColumn = async (columnId: string) => {
    setBoardData((prev) => {
      const col = prev.columns[columnId];

      const deletedTasks = col.taskIds;
      const newTasks = Object.fromEntries(
        Object.entries(prev.tasks).filter((task) => {
          return !deletedTasks.includes(task[1].id);
        })
      );

      const newCols = Object.fromEntries(
        Object.entries(prev.columns).filter((col) => {
          return col[0] !== columnId;
        })
      );

      const newOrder = prev.columnOrder.filter((colId) => colId != columnId);

      return {
        ...prev,
        tasks: newTasks,
        columns: newCols,
        columnOrder: newOrder,
      };
    });
    console.log("Here to delete the column!!");
    const res = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/column/${columnId}`
    );

    console.log("Response from the backend is : ",res);
  };

  return (
    <BoardContext.Provider
      value={{
        boardData,
        online,
        setBoardData,
        addTask,
        updateTask,
        deleteTask,
        addColumn,
        updateColumn,
        rearrangeColumns,
        deleteColumn,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) throw new Error("useBoard must be used within a BoardProvider");
  return context;
};
