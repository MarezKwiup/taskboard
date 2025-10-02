import { useState } from "react";
import { useBoard } from "../context/BoardContext";
import { useSortable } from "@dnd-kit/sortable";
import { type EditState } from "../types/task";
import { CSS } from "@dnd-kit/utilities";
interface TaskProps {
  taskId: string;
}

import { RxPencil1 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import EditTask from "./EditTask";
const TaskCard = (props: TaskProps) => {
  const { boardData, deleteTask } = useBoard();
  const [showButtons, setShowButtons] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editState, setEditState] = useState<EditState>({
    title: "",
    description: "",
  });

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.taskId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
            <button
              className="flex border-0 rounded-full hover:bg-violet-100 h-7 w-7 items-center justify-center hover:text-[#6043EF]"
              onClick={(e) => {
                console.log("Click on the edit button!!");
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <RxPencil1 size={20} />
            </button>
            <button
              className="flex ml-3 border-0 rounded-full hover:bg-violet-100 h-7 w-7 items-center justify-center"
              onClick={(e) => {
                console.log("Click on the delete button!");
                e.stopPropagation();
                deleteTask(props.taskId);
              }}
            >
              <MdDelete size={20} color="#de432f" />
            </button>
          </div>
        )}
      </div>

      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
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
    </div>
  ) : (
    <EditTask
      setEditState={setEditState}
      setIsEditing={setIsEditing}
      editState={editState}
      taskId={props.taskId}
    />
  );
};

export default TaskCard;
