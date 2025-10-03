import {io,Socket} from 'socket.io-client';
import type { BoardData } from './types/board';

const socket:Socket = io('http://localhost:4000');

export default socket;