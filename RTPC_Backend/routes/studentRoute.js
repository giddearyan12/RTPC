import express from 'express'
const studentRouter = express.Router();
import {studentsList, requestCollaboration, deleteProject, getUserProfile, updateUser} from '../controllers/studentController.js'

studentRouter.get('/', studentsList);

studentRouter.post('/requestcollaboration', requestCollaboration);
studentRouter.delete('/deleteProject/:id', deleteProject);
studentRouter.get('/profile', getUserProfile);
studentRouter.put('/profile', updateUser);


export default studentRouter;