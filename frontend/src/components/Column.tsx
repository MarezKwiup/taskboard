import { type Column } from "../types/board";
import TaskCard from "./Task";
import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import EditColumn from "./EditColumn";
import AddTask from "./AddTask";
import ECN from "./EditColumnName";
import { useBoard } from "../context/BoardContext";

interface ColumnProps {
  column: Column;
  index: number;
}

const colorClasses = [
  "border-l-[#6366f1]",
  "border-l-[#8b5cf6]",
  "border-l-[#10b981]",
  "border-l-[#f59e0b]",
  "border-l-[#ef4444]",
  "border-l-[#06b6d4]",
  "border-l-[#8b5cf6]",
  "border-l-[#ec4899]",
  "border-l-[#6b7280]",
  "border-l-[#64748b]",
];

const ColumnCard = (props: ColumnProps) => {
  const { column, index } = props;
  const [addTaskBtn, setAddTaskBtn] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [editModal, setEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const {boardData}=useBoard();

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setEditModal(false);
      }
    };

    if (editModal) window.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [editModal]);

  const handleAddTask = () => {
    setAddTaskBtn((prev) => !prev);
  };

  return (
    <SortableContext
      id={column.id}
      items={column.taskIds}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className={`border ${
          colorClasses[index % colorClasses.length]
        } border-l-5 border-y-[#DCDCE5] border-r-[#DCDCE5] rounded-2xl p-4 flex flex-col min-h-130 min-w-[320px] bg-[#FFFFFF]`}
      >
        <div className="flex justify-between items-center">
          {!isEditing ? (
            <div className="flex items-center">
              <span className="font-semibold text-xl">{column.title}</span>
              <p className="text-sm ml-2 border-0 rounded-full bg-[#d7d7dc] w-5 h-5">
                {column.taskIds.length}
              </p>
            </div>
          ) : (
            <ECN
              setIsEditing={setIsEditing}
              setEditModal={setEditModal}
              column={column}
            />
          )}
          <button
            className="border-0 rounded-md hover:bg-[#EDEBFF]"
            onClick={(e) => {
              e.stopPropagation();
              setEditModal((prev) => {
                return !prev;
              });
            }}
          >
            <BsThreeDotsVertical size={20} className="m-2" />
          </button>
        </div>
        {editModal && (
          <EditColumn
            column={column}
            modalRef={modalRef}
            setIsEditing={setIsEditing}
            setEditModal={setEditModal}
          />
        )}
        <div>
          <ul>
            {column.taskIds.map((taskId) => {
              const task = boardData.tasks[taskId];
              if (!task) return null;
              return <TaskCard taskId={taskId} task={task} />;
            })}
          </ul>
        </div>
        <div>
          {!addTaskBtn ? (
            <button
              className="text-[#7c7c80] border-0 rounded-md w-[90%] h-10 hover:bg-purple-100 hover:text-black"
              onClick={handleAddTask}
            >
              + Add a task
            </button>
          ) : (
            <AddTask
              title={title}
              setTitle={setTitle}
              column={column}
              setAddTaskBtn={setAddTaskBtn}
            />
          )}
        </div>
      </div>
    </SortableContext>
  );
};

export default ColumnCard;
