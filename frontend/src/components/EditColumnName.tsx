import { useBoard } from "../context/BoardContext";
import type { Column } from "../types/board";
interface ECNProps {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  column: Column;
}

const ECN = ({ setIsEditing, setEditModal, column }: ECNProps) => {
  const { updateColumn } = useBoard();
  return (
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
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
      />
    </form>
  );
};

export default ECN;
