import express from 'express'
import  mongoose from'mongoose'
import cors from 'cors'
import userRouter from './routes/userRoute.js';
import messageRoutes from './routes/messageRoute.js';
import membersRoutes from './routes/membersRoute.js';
import cookieParser from "cookie-parser";
import studentRouter from './routes/studentRoute.js';
import { app, server } from './socket/socket.js';
import 'dotenv/config'

const port = 3000

mongoose.connect('mongodb://127.0.0.1:27017/RTPC')
.then(()=>console.log('MONGO DB CONNECTED'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use('/user', userRouter)
app.use('/students', studentRouter)
app.use("/api/messages", messageRoutes);
app.use("/api/members", membersRoutes);


app.get('/',(req,res)=>{
  res.end("API Working")
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})