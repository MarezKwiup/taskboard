import { type EditState } from "../types/task";
import { useBoard } from "../context/BoardContext";
import { type Task } from "../types/board";

interface EditTaskProps {
  editState: EditState;
  setEditState: React.Dispatch<React.SetStateAction<EditState>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  taskId: string;
}

const EditTask = ({
  editState,
  setEditState,
  setIsEditing,
  taskId,
}: EditTaskProps) => {
  const { updateTask } = useBoard();

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editState.title.trim()) {
      let partialTask: Partial<Task> = editState.description?.trim()
        ? {
            title: editState.title,
            description: editState.description,
          }
        : {
            title: editState.title,
          };
      updateTask(taskId, partialTask);
      setEditState({
        title: editState.title,
        description:editState.description
      });
      setIsEditing(false);
    }
  };

  return (
    <form
      onSubmit={handleEditSubmit}
      className="flex flex-col border border-[#DCDCE5] rounded-xl text-left items-center justify-center"
    >
      <input
        type="text"
        placeholder="Task title..."
        value={editState.title}
        className="flex justify-center items-center border border-[#DCDCE5] w-[90%] h-10 m-3 p-2 rounded-lg bg-[#F7F7F8] focus:border-[#6043EF] focus:outline-none focus:border-2"
        onChange={(e) =>
          setEditState((prev) => {
            return {
              ...prev,
              title: e.target.value,
            };
          })
        }
      />

      <textarea
        placeholder="Task description (optional)..."
        className="border border-[#DCDCE5] w-[90%] h-30 p-2 rounded-lg bg-[#F7F7F8] text-left focus:border-[#6043EF] focus:outline-none focus:border-2"
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
      <div className="flex m-3 h-10 w-[90%]">
        <button
          type="submit"
          className="flex-1 py-2 border-0 rounded-lg bg-[#6043EF] text-white hover:bg-[#6d53f0]"
        >
          Save
        </button>
        <button
          type="button"
          className="flex-1 py-2 ml-2 bg-[#F7F7F8] border border-[#DCDCE5] rounded-lg hover:bg-[#e2e2e6] hover:text-[#6043EF]"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditTask;