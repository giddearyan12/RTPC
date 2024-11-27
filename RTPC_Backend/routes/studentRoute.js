import express from 'express'
const studentRouter = express.Router();
import {studentsList, requestCollaboration, deleteProject} from '../controllers/studentController.js'

studentRouter.get('/', studentsList);

studentRouter.post('/requestcollaboration', requestCollaboration);
studentRouter.delete('/deleteProject/:id', deleteProject);


export default studentRouter;