import {createServer} from 'http';
import express from 'express';
import cors from 'cors';
import {Server} from 'socket.io';
import boardRoutes from './routes/board.routes.js';
import { mockData } from './mockData.js';

const app = express();

const httpServer=createServer(app);

const io = new Server(httpServer,{
    cors:{origin:'*'}
})

app.use(cors());
app.use(express.json())

app.use('/api/board',boardRoutes);

io.on('connection',(socket)=>{
    console.log('Client connected: ',socket.id);

    socket.emit('boardData',mockData);

    socket.on('disconnect',()=>{
        console.log('Client disconnected: ',socket.id)
    })
})

httpServer.listen(4000,()=>{
    console.log('Server running on port 4000');
})