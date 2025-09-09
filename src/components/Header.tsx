import { CiWifiOff } from "react-icons/ci";
import { CiWifiOn } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useBoard } from "../context/BoardContext";

const Header = () => {
  const {online,boardData}=useBoard();
  const tasksCount=Object.keys(boardData.tasks).length;
  const columnsCount=Object.keys(boardData.columns).length;

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
          <FiUsers color="#797986" size={20} className="ml-3 mt-0.5"/>
          <p className="ml-1">2 Online</p>
        </div>
      </div>
      <div className="flex pt-2 mt-2">
        <div className="flex justify-center items-center">{tasksCount} tasks</div>
        <div className="flex justify-center items-center ml-2">{columnsCount} columns</div>
      </div>
    </div>
  );
};

export default Header;
