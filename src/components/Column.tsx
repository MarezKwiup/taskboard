import { type Column } from "../types/board";
import TaskCard from "./Task";
import { useState, useRef, useEffect } from "react";
import { useBoard } from "../context/BoardContext";
import { v4 as uuidv4 } from "uuid";
import { type Task } from "../types/board";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RxPencil1 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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
  const { addTask, deleteColumn, updateColumn } = useBoard();
  const [addTaskBtn, setAddTaskBtn] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [editModal, setEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

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

  const handleEditModalClick = () => {
    setIsEditing(true);
    setEditModal(false);
  };

  return (
    <SortableContext id={column.id} items={column.taskIds} strategy={verticalListSortingStrategy}>
      <div
      ref={setNodeRef}
        className={`border ${
          colorClasses[index % colorClasses.length]
        } border-l-5 border-y-[#DCDCE5] border-r-[#DCDCE5] rounded-2xl p-4 flex flex-col w-[25%] bg-[#FFFFFF]`}
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Submitted:", e.currentTarget.message.value);
                const partialColumn: Partial<Column> = {
                  title: e.currentTarget.message.value,
                };
                updateColumn(column.id, partialColumn);
                setIsEditing(false);
                setEditModal(false);
              }}
            >
              <input
                name="message"
                type="text"
                placeholder="Type something..."
                className="border rounded-lg p-2 w-full border-[#DCDCE5] focus:border-[#6043EF] focus:outline-none focus:border-2 "
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevents newline
                    e.currentTarget.form?.requestSubmit(); // Triggers form submit
                  }
                }}
              />
            </form>
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
          <div
            ref={modalRef}
            className="flex flex-col justify-center items-center h-20"
          >
            <button
              className="flex justify-center items-center hover:bg-[#EDEBFF] border-0 rounded-md w-[100%] mt-2 h-[50%]"
              onClick={handleEditModalClick}
            >
              <RxPencil1 size={20} />
              <p className="ml-2">Edit Column Title</p>
            </button>
            <button
              className="flex justify-center items-center hover:bg-[#EDEBFF] border-0 rounded-md w-[100%] mt-2 h-[50%]"
              onClick={() => {
                deleteColumn(column.id);
                setEditModal(false);
              }}
            >
              <MdDelete size={20} color="#de432f" />
              <p className="ml-2 text-[#de432f]">Delete Column</p>
            </button>
          </div>
        )}
        <div>
          <ul>
            {column.taskIds.map((taskId) => (
              <li key={taskId}>
                <TaskCard key={taskId} taskId={taskId}></TaskCard>
              </li>
            ))}
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
          )}
        </div>
      </div>
    </SortableContext>
  );
};

export default ColumnCard;
