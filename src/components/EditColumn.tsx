import { useBoard } from "../context/BoardContext";
import { RxPencil1 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import type { Column } from "../types/board";

interface EditColumnProps {
  modalRef: React.RefObject<HTMLDivElement | null>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  column: Column;
}

const EditColumn = ({
  modalRef,
  setIsEditing,
  setEditModal,
  column,
}: EditColumnProps) => {
  const { deleteColumn } = useBoard();
  const handleEditModalClick = () => {
    setIsEditing(true);
    setEditModal(false);
  };
  return (
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
  );
};

export default EditColumn;
