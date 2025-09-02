import { type BoardData } from "../types/board";

export const initialData: BoardData = {
  tasks: {
    "task-1": { id: "task-1", title: "Setup project", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    "task-2": { id: "task-2", title: "Design UI", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    "task-3": { id: "task-3", title: "Integrate backend", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  },
  columns: {
    "column-1": { id: "column-1", title: "To Do", taskIds: ["task-1", "task-2", "task-3"] },
    "column-2": { id: "column-2", title: "In Progress", taskIds: [] },
    "column-3": { id: "column-3", title: "Done", taskIds: [] },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};
