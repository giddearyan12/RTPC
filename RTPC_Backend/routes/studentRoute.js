import express from 'express'
const studentRouter = express.Router();
import {studentsList, requestCollaboration} from '../controllers/studentController.js'

studentRouter.get('/', studentsList);

studentRouter.post('/requestcollaboration', requestCollaboration);


export default studentRouter;