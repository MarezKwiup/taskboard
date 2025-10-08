import { CiWifiOff } from "react-icons/ci";
import { CiWifiOn } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
import { useEffect, useState, useRef } from "react";
import { useBoard } from "../context/BoardContext";
import { v4 as uuidv4 } from "uuid";
import type { Column } from "../types/board";

const Header = () => {
  const { online, boardData, addColumn,activeUsers } = useBoard();
  const tasksCount = Object.keys(boardData.tasks).length;
  const columnsCount = Object.keys(boardData.columns).length;
  const modalRef = useRef<HTMLDivElement>(null);
  const [addModal, setAddModal] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState<string>("");

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setAddModal(false);
      }
    };

    if (addModal) window.addEventListener("mousedown", handleOutsideClick);

    () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [addModal]);

  const handleCreateColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn: Column = {
        id: `column-${uuidv4()}`,
        title: newColumnTitle,
        taskIds: [],
      };

      addColumn(newColumn);
      setNewColumnTitle('');
      setAddModal(false);
    }
  };

  return (
    <div className="flex justify-between m-4 p-4 ml-2">
      <div className="flex flex-col">
        <span className="text-4xl font-semibold">Taskboard</span>
        <div className="flex mt-4 text-[#797986] mr-">
          {online ? (
            <>
              <CiWifiOn color="#23C45D" size={24} />
              <p className="ml-2 ">Real time sync is active</p>
            </>
          ) : (
            <>
              <CiWifiOff color="#EE4443" size={24} />
              <p className="ml-2 ">Real time sync is inactive</p>
            </>
          )}
          <FiUsers color="#797986" size={20} className="ml-3 mt-0.5" />
          <p className="ml-1">{activeUsers} Online</p>
        </div>
      </div>
      <div className="flex pt-2 mt-2">
        <div className="flex justify-center items-center w-25 h-10 border rounded-md  border-[#DCDCE5]">
          {tasksCount} tasks
        </div>
        <div className="flex justify-center items-center ml-2  w-25 h-10 border rounded-md  border-[#DCDCE5]  ">
          {columnsCount} columns
        </div>
      </div>
      <button
        className="mr-10 text-xl border rounded-md  border-[#DCDCE5] w-35 hover:bg-[#EDEBFF]"
        onClick={() => setAddModal(!addModal)}
      >
        Add Column
      </button>
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md border border-[#DCDCE5]"
          >
            <div className="flex flex-col">
              <div className="flex justify-between">
                <p className="text-lg">Create New Column</p>
                <button
                  className="text-lg border-0 rounded-md hover:bg-[#EDEBFF] w-8"
                  onClick={() => {
                    setNewColumnTitle("");
                    setAddModal(false);
                  }}
                >
                  X
                </button>
              </div>
              <div className="flex mt-4">Column Title</div>
              <input
                className="flex mt-4 border rounded-md border-[#DCDCE5] focus:border-[#6043EF] focus:outline-none  focus:border-3 h-10 p-3"
                type="text"
                value={newColumnTitle}
                placeholder="Enter column title..."
                onChange={(e) => setNewColumnTitle(e.target.value)}
              />
              <div className="flex justify-between mt-4">
                <button
                  className="border-0 rounded-lg bg-[#6043EF] text-white w-[70%] hover:bg-[#6d53f0] h-10"
                  onClick={handleCreateColumn}
                >
                  Create Column
                </button>
                <button
                  className="ml-2 bg-[#F7F7F8] w-[30%] border border-[#DCDCE5] rounded-lg hover:bg-[#e2e2e6] hover:text-[#6043EF]"
                  onClick={() => {
                    setNewColumnTitle("");
                    setAddModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
