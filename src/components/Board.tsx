import { useBoard } from "../context/BoardContext";
import ColumnCard from "./Column";


const Board=()=>{
    const {boardData}=useBoard();
    return(
       <div className="p-5">
        <div className="flex overflow-x-auto h-full p-4 gap-4">
            {
                Object.values(boardData.columns).map((column,index)=>(
    
                    <ColumnCard column={column} index={index}/>
                ))
            }
        </div>
       </div>
    )
}
export default Board;