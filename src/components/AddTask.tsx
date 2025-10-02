import { useBoard } from "../context/BoardContext";
import type { Column, Task } from "../types/board";
import { v4 as uuidv4 } from "uuid";

interface AddTaskProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  column: Column;
  setAddTaskBtn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddTask = ({ title, setTitle, column, setAddTaskBtn }: AddTaskProps) => {
  const { addTask } = useBoard();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      console.log("New task:", title, "for column:", column.id);
      // later: call board context's addTask(column.id, title)
      const newTask: Task = {
        id: `task-${uuidv4()}`,
        title: title,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      addTask(column.id, newTask);
      setTitle("");
      setAddTaskBtn(false);
    }
  };

  const handleAddTask = () => {
    setAddTaskBtn((prev) => !prev);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        className="bg-[#F7F7F8] border border-[#DCDCE5] rounded-lg p-2 focus:border-[#6043EF] focus:outline-none focus:border-2"
      />
      <div className="flex m-3 h-10">
        <button
          type="submit"
          className="border-0 rounded-lg bg-[#6043EF] text-white w-[70%] hover:bg-[#6d53f0]"
        >
          Add
        </button>
        <button
          type="button"
          className="ml-2 bg-[#F7F7F8] w-[30%] border border-[#DCDCE5] rounded-lg hover:bg-[#e2e2e6] hover:text-[#6043EF]"
          onClick={handleAddTask}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTask;
