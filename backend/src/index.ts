import 'dotenv/config';

import {createServer} from 'http';
import express from 'express';
import cors from 'cors';
import {Server} from 'socket.io';
import boardRoutes from './routes/board.routes.js';
import taskRoutes from './routes/tasks.routes.js'
import columnRoutes from './routes/column.routes.js'
import { getBoard } from './controllers/board.controller.js'

const app = express();

const httpServer=createServer(app);

export const io = new Server(httpServer,{
    cors:{origin:'*'}
})

app.use(cors());
app.use(express.json())

app.use('/api/board',boardRoutes);
app.use('/api/tasks',taskRoutes);
app.use('/api/column',columnRoutes);

io.on('connection',async (socket)=>{
    console.log('Client connected: ',socket.id);

    const boardData=await getBoard();
    socket.emit('boardData',boardData);

    io.emit('activeUsersCount',io.engine.clientsCount);

    socket.on('disconnect',()=>{
        console.log('Client disconnected: ',socket.id)

        io.emit('activeUsersCount',io.engine.clientsCount);
    })
})

httpServer.listen(4000,()=>{
    console.log('Server running on port 4000');
})