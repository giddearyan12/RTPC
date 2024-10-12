import express from 'express'
import  mongoose from'mongoose'
import cors from 'cors'
import userRouter from './routes/userRoute.js';
import studentRouter from './routes/studentRoute.js';
import 'dotenv/config'
const app = express()
const port = 3000

mongoose.connect('mongodb://127.0.0.1:27017/RTPC')
.then(()=>console.log('MONGO DB CONNECTED'));
app.use(cors());
app.use(express.json());


app.use('/user', userRouter)
app.use('/students', studentRouter)


app.get('/',(req,res)=>{
  res.end("API Working")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})