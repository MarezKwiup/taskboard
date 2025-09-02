import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { initialData } from './data/mockData'
import './App.css'
import Header from './components/Header'

function App(){
  console.log("First tasks is : ",initialData.tasks['task-1']);
  return (
    <div className='bg-[#FBFBFC] h-screen w-screen'> 
      <Header/>
      <h1 className='text-amber-300'>My taskboard</h1>
    </div>
  )
}

export default App
