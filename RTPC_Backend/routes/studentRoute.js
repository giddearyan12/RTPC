import express from 'express'
const studentRouter = express.Router();
import {studentsList} from '../controllers/studentController.js'

studentRouter.get('/', studentsList);


export default studentRouter;