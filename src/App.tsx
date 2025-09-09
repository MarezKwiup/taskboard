import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { initialData } from './data/mockData'
import './App.css'
import Header from './components/Header'
import { useBoard } from './context/BoardContext'
import Board from './components/Board'

function App(){
  const {boardData}=useBoard();
  console.log("First tasks is : ",boardData.tasks['task-1']);
  return (
    <div className='bg-[#FBFBFC] h-screen w-screen'> 
      <Header/>
      <Board/>
    </div>
  )
}

export default App
