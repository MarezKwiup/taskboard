import React, {useState,useEffect,useContext,createContext} from 'react';
import { type BoardData,type Task,type Column } from '../types/board';
import { initialData } from '../data/mockData';
import { type SetStateAction,type Dispatch } from 'react';
type BoardContextType = {
    boardData:BoardData;
    online:boolean;
    setBoardData:Dispatch<SetStateAction<BoardData>>;
    addTask: (columnId:string,task:Task)=>void;
    updateTask:(taskId:string,updatedTask:Partial<Task>)=>void;
    deleteTask:(taskId:string)=>void;
    addColumn:(column:Column)=>void;
    updateColumn:(columnId:string,updatedColumn:Partial<Column>)=>void;
    rearrangeColumns:(newOrder:string[])=>void;
    deleteColumn:(columnId:string)=>void;
}

const BoardContext=createContext<BoardContextType|undefined>(undefined);

export const BoardProvider:React.FC<{children:React.ReactNode}>=({children})=>{
    const [online,setOnline]=useState<boolean>(navigator.onLine);
    const [boardData,setBoardData]=useState<BoardData>(initialData);

    useEffect(()=>{
        const handleOnline=()=>setOnline(true);
        const handleOffline=()=>setOnline(false);

        window.addEventListener('online',handleOnline);
        window.addEventListener('offline',handleOffline);

        return ()=>{
            window.removeEventListener('online',handleOnline);
            window.removeEventListener('offline',handleOffline);
        }
    },[]);

    const addTask=(columnId:string,task:Task)=>{
        setBoardData((prev)=>{
            const newTasks={
                ...prev.tasks,
                [task.id]:task
            }

            const column=prev.columns[columnId];
            const updatedColumn:Column={
                ...column,
                taskIds: [...column.taskIds,task.id]
            }

            return {
                ...prev,
                tasks:newTasks,
                columns:{
                    ...prev.columns,
                    [columnId]:updatedColumn
                }
            }
        })
    }

    const updateTask=(taskId:string,updatedTask:Partial<Task>)=>{
        setBoardData((prev)=>({
            ...prev,
            tasks:{
                ...prev.tasks,
                [taskId]:{...prev.tasks[taskId],...updatedTask,updatedAt:new Date().toISOString()}
            }
        }))
    }

    const deleteTask=(taskId:string)=>{
        setBoardData((prev)=>{
            const newTasks = {...prev.tasks};
            delete newTasks[taskId];

            const newColumns=Object.fromEntries(
                Object.entries(prev.columns).map(([colId,col])=>[
                    colId,
                    {...col,taskIds:col.taskIds.filter((id)=>id!==taskId)}
                ])
            )

            return {
                ...prev,
                tasks:newTasks,
                columns:newColumns
            }
        })
    }

    //Column methods
    const addColumn=(column:Column)=>{
        setBoardData((prev)=>({
            ...prev,
            columns:{...prev.columns,[column.id]:column},
            columnOrder:[...prev.columnOrder,column.id]
        }))
    }

    const updateColumn=(columnId:string,updatedColumn:Partial<Column>)=>{
        setBoardData((prev)=>({
            ...prev,
            columns:{
                ...prev.columns,
                [columnId]:{...prev.columns[columnId],...updatedColumn,}
            }
        }))
    }

    const rearrangeColumns=(newOrder:string[])=>{
        setBoardData((prev)=>({
            ...prev,
            columnOrder:newOrder
        }))
    }

    const deleteColumn=(columnId:string)=>{
        setBoardData((prev)=>{
            const col=prev.columns[columnId];

            const deletedTasks=col.taskIds;
            const newTasks=Object.fromEntries(Object.entries(prev.tasks).filter((task)=>{
                return !deletedTasks.includes(task[1].id)
            }))

            const newCols=Object.fromEntries(Object.entries(prev.columns).filter((col)=>{
                return col[0]!==columnId
            }))

            const newOrder=prev.columnOrder.filter(colId=>colId!=columnId);

            return {
                ...prev,
                tasks:newTasks,
                columns:newCols,
                columnOrder:newOrder
            }
        })
    }

    return (
        <BoardContext.Provider
value={{ boardData, online,setBoardData, addTask, updateTask, deleteTask, addColumn, updateColumn, rearrangeColumns,deleteColumn }}
        >
            {children}
        </BoardContext.Provider>
    )

}

export const useBoard = ()=>{
    const context=useContext(BoardContext);
    if (!context) throw new Error("useBoard must be used within a BoardProvider");
    return context;
}