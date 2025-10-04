export type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

export type BoardData = {
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
  columnOrder: string[]; // order of columns
};
