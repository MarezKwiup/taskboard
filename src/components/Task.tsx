import { useEffect, useState } from "react";
import { useBoard } from "../context/BoardContext";
interface TaskProps {
  taskId: string;
}

interface EditState {
  title: string;
  description?: string;
}

import { RxPencil1 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
const TaskCard = (props: TaskProps) => {
  const { boardData, deleteTask } = useBoard();
  const [showButtons, setShowButtons] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editState, setEditState] = useState<EditState>({
    title: "",
    description: "",
  });

  const handleEditSubmit = () => {
    console.log("Here inside handle edit submit!!!");
  };

  const task = boardData.tasks[props.taskId];
  return !isEditing ? (
    <div
      className="flex flex-col border border-[#DCDCE5] m-3 p-3 rounded-xl text-left transition transform hover:-translate-y-1 hover:shadow-md"
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      <div className="flex justify-between items-center">
        <p className="font-medium">{task.title}</p>
        {showButtons && (
          <div className="flex">
            <button className="flex border-0 rounded-full hover:bg-violet-100 h-7 w-7 items-center justify-center hover:text-[#6043EF]">
              <RxPencil1 size={20} onClick={() => setIsEditing(true)} />
            </button>
            <button
              className="flex ml-3 border-0 rounded-full hover:bg-violet-100 h-7 w-7 items-center justify-center"
              onClick={() => deleteTask(props.taskId)}
            >
              <MdDelete size={20} color="#de432f" />
            </button>
          </div>
        )}
      </div>
      <p className="text-sm text-[#7c7c80] pt-3">{task.description}</p>
      <p className="pt-2 text-sm text-[#7c7c80]">
        Updated{" "}
        {new Date(task.updatedAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </p>
    </div>
  ) : (
    <form
      onSubmit={handleEditSubmit}
      className="flex flex-col border border-[#DCDCE5] rounded-xl text-left items-center justify-center"
    >
      <input
        type="text"
        placeholder="Task title..."
        value={editState.title}
        className="flex justify-center items-center border border-[#DCDCE5] w-[90%] h-10 m-3 p-2 rounded-lg bg-[#F7F7F8]"
        onChange={(e) =>
          setEditState((prev) => {
            return {
              ...prev,
              title: e.target.value,
            };
          })
        }
      />

      <input
        type="text"
        placeholder="Task description (optional)..."
        className="border border-[#DCDCE5] w-[90%] h-30 p-2 rounded-lg bg-[#F7F7F8] text-left"
        value={editState.description}
        onChange={(e) =>
          setEditState((prev) => {
            return {
              ...prev,
              description: e.target.value,
            };
          })
        }
      />

      <button type="submit">Save</button>
      <button type="button" onClick={() => setIsEditing(false)}>
        Cancel
      </button>
    </form>
  );
};

export default TaskCard;
