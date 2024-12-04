import express from 'express'
const studentRouter = express.Router();
import {studentsList, requestCollaboration, deleteProject, getUserProfile, updateUser, teamData, notificationFun, notificationRespond} from '../controllers/studentController.js'

studentRouter.get('/', studentsList);

studentRouter.post('/requestcollaboration', requestCollaboration);
studentRouter.delete('/deleteProject/:id', deleteProject);
studentRouter.get('/profile', getUserProfile);
studentRouter.put('/profile', updateUser);
studentRouter.get('/team', teamData);
studentRouter.get('/notifications', notificationFun);
studentRouter.post('/notifications/:id/respond', notificationRespond);


export default studentRouter;