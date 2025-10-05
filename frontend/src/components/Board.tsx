import { useState } from "react";
import { useBoard } from "../context/BoardContext";
import ColumnCard from "./Column";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
  pointerWithin,
} from "@dnd-kit/core";
import TaskCard from "./Task";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import axios from "axios";

import { arrayMove } from "@dnd-kit/sortable";

const Board = () => {
  const { boardData, setBoardData } = useBoard();
  console.log("Board data is : ", boardData);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragStart(event: DragStartEvent) {
    const { id } = event.active;
    setActiveId(id as string);
  }

  function findContainer(id: string) {
    if (id in boardData.columns) {
      return id;
    }
    return Object.keys(boardData.columns).find((key) =>
      boardData.columns[key].taskIds.includes(id)
    );
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    console.log("Active id is : ", activeId);
    console.log("Over id is : ", overId);

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    console.log("Active container is. : ", activeContainer);
    console.log("over container is : ", overContainer);

    if (!activeContainer || !overContainer) {
      setActiveId(null);
      return;
    }

    // If moving within the same column
    if (activeContainer === overContainer) {
      console.log("Moving within the same column!!");
      const column = boardData.columns[activeContainer];

      console.log("Column is : ", column);
      const oldIndex = column.taskIds.indexOf(activeId);
      const newIndex = column.taskIds.indexOf(overId);

      const updatedColumn = {
        ...column,
        taskIds: arrayMove(column.taskIds, oldIndex, newIndex),
      };

      if (oldIndex !== newIndex) {
        setBoardData((prev) => ({
          ...prev,
          columns: {
            ...prev.columns,
            [activeContainer]: updatedColumn,
          },
        }));

        console.log("Updated column is : ", updatedColumn);

        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/column/rearrange-sc`,
          {
            id: updatedColumn.id,
            taskIds: updatedColumn.taskIds,
          }
        );

        console.log("Response from the backend is : ", res);
      }
    } else {
      // Moving to a different column
      console.log("Moving within different columns!");

      const fromColumn = boardData.columns[activeContainer];
      const toColumn = boardData.columns[overContainer];

      console.log("From column:", fromColumn.title);
      console.log("To column:", toColumn.title);

      // Remove from old column
      const newFromTasks = fromColumn.taskIds.filter((id) => id !== activeId);

      // Add to new column
      let newToTasks;
      if (overId in boardData.columns) {
        // If dropping into an empty column
        console.log("To column is empty!");
        newToTasks = [...toColumn.taskIds, activeId];
      } else {
        // If dropping in between tasks
        const overIndex = toColumn.taskIds.indexOf(overId);
        newToTasks = [
          ...toColumn.taskIds.slice(0, overIndex + 1),
          activeId,
          ...toColumn.taskIds.slice(overIndex + 1),
        ];
      }

      const updatedFromColumn = {
        ...fromColumn,
        taskIds: newFromTasks,
      };

      const updatedToColumn = {
        ...toColumn,
        taskIds: newToTasks,
      };

      console.log("Updated from column is : ",updatedFromColumn);
      console.log("Updated to column is : ",updatedToColumn);
      console.log("Task id is : ",activeId);

      setBoardData((prev) => ({
        ...prev,
        columns: {
          ...prev.columns,
          [activeContainer]: updatedFromColumn,
          [overContainer]: updatedToColumn,
        },
      }));

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/column/rearrange-dc`,
          {
            fromColumnId: updatedFromColumn.id,
            toColumnId: updatedToColumn.id,
            fromTaskIds: updatedFromColumn.taskIds,
            toTaskIds: updatedToColumn.taskIds,
            taskId:activeId
          }
        );

        console.log("Response from backend:", res.data);
      } catch (error) {
        console.error("Error while rearranging between columns:", error);
      }
    }

    setActiveId(null);
  }

  function customCollisionDetection(args: any) {
    const rectCollision = rectIntersection(args);

    if (rectCollision.length > 0) {
      return rectCollision;
    }

    return closestCorners(args);
  }

  return (
    <div className="p-5">
      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex overflow-x-auto h-full p-4 gap-4">
          {boardData.columnOrder.map((columnId, index) => {
            const column = boardData.columns[columnId];
            if (!column) return null; // safeguard in case of missing column
            return <ColumnCard key={column.id} column={column} index={index} />;
          })}
        </div>
        <DragOverlay className="dnd-kit-overlay">
          {activeId ? (
            <TaskCard taskId={activeId} task={boardData.tasks[activeId]} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Board;
