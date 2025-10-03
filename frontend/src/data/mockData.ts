import { type BoardData } from "../types/board";

export const initialData: BoardData = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Setup project",
      description: "Initialize repository, configure TypeScript, and install dependencies.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    "task-2": {
      id: "task-2",
      title: "Design UI",
      description: "Create wireframes and mockups for the dashboard and task board.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    "task-3": {
      id: "task-3",
      title: "Integrate backend",
      description: "Connect the frontend with APIs and set up database models.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    "task-4": {
      id: "task-4",
      title: "Implement drag-and-drop",
      description: "Add functionality to rearrange tasks between columns using React DnD.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    "task-5": {
      id: "task-5",
      title: "Authentication flow",
      description: "Implement login, signup, and logout using JWT and refresh tokens.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    "task-6": {
      id: "task-6",
      title: "Setup CI/CD",
      description: "Configure GitHub Actions for automated testing and deployment.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    "task-7": {
      id: "task-7",
      title: "Write unit tests",
      description: "Add Jest + React Testing Library tests for critical components.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    "task-8": {
      id: "task-8",
      title: "Polish UI",
      description: "Improve styling with TailwindCSS, add responsive design, and dark mode.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  columns: {
    "column-1": { id: "column-1", title: "To Do", taskIds: ["task-1", "task-2", "task-5"] },
    "column-2": { id: "column-2", title: "In Progress", taskIds: ["task-3", "task-4"] },
    "column-3": { id: "column-3", title: "Done", taskIds: ["task-6", "task-7", "task-8"] },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};
