import { useBoard } from "../context/BoardContext";
import ColumnCard from "./Column";

const Board=()=>{
    const {boardData}=useBoard();
    console.log("Board columns are : ",boardData.columns)
    return(
       <div>
        <div className="flex overflow-x-auto h-full p-4 gap-4">
            {
                Object.values(boardData.columns).map((column)=>(
                    <ColumnCard column={column}/>
                ))
            }
        </div>
       </div>
    )
}
export default Board;