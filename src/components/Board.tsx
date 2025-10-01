import { useState } from "react";
import { useBoard } from "../context/BoardContext";
import ColumnCard from "./Column";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import TaskCard from "./Task";
import type {
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";

import { arrayMove } from "@dnd-kit/sortable";

const Board = () => {
  const { boardData, setBoardData } = useBoard();
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) {
      setActiveId(null);
      return;
    }

    // If moving within the same column
    if (activeContainer === overContainer) {
      const column = boardData.columns[activeContainer];
      const oldIndex = column.taskIds.indexOf(activeId);
      const newIndex = column.taskIds.indexOf(overId);

      if (oldIndex !== newIndex) {
        setBoardData((prev) => ({
          ...prev,
          columns: {
            ...prev.columns,
            [activeContainer]: {
              ...column,
              taskIds: arrayMove(column.taskIds, oldIndex, newIndex),
            },
          },
        }));
      }
    } else {
      // Moving to a different column
      setBoardData((prev) => {
        const fromColumn = prev.columns[activeContainer];
        const toColumn = prev.columns[overContainer];

        const newFromTasks = fromColumn.taskIds.filter((id) => id !== activeId);
        const overIndex = toColumn.taskIds.indexOf(overId);
        const newToTasks = [
          ...toColumn.taskIds.slice(0, overIndex + 1),
          activeId,
          ...toColumn.taskIds.slice(overIndex + 1),
        ];

        return {
          ...prev,
          columns: {
            ...prev.columns,
            [activeContainer]: {
              ...fromColumn,
              taskIds: newFromTasks,
            },
            [overContainer]: {
              ...toColumn,
              taskIds: newToTasks,
            },
          },
        };
      });
    }

    setActiveId(null);
  }

  return (
    <div className="p-5">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd} // ✅ only update state here
      >
        <div className="flex overflow-x-auto h-full p-4 gap-4">
          {Object.values(boardData.columns).map((column, index) => (
            <ColumnCard key={column.id} column={column} index={index} />
          ))}
        </div>
        <DragOverlay>
          {activeId ? <TaskCard taskId={activeId} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Board;
