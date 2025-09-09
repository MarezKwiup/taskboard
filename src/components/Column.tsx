import { type Column } from "../types/board"

interface ColumnProps{
    column:Column
}

const ColumnCard=(props:ColumnProps)=>{
    const {column}=props;
    console.log("Column is : ",column);
    return (
        <div className="border border-r-amber-400 rounded-2xl">
            This is a column {column.id}
        </div>
    )
}

export default ColumnCard