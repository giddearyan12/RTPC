import express from 'express';
import {getAllProjects, rejectProject, removeMember, verifyProject, getNewProjects, removeProject} from '../controllers/adminControllers.js'

const adminRouter = express.Router();

adminRouter.post('/verify', verifyProject);
adminRouter.get('/newProjects', getNewProjects);
adminRouter.get('/allProjects', getAllProjects);
adminRouter.post('/reject', rejectProject);
adminRouter.post('/id/:studentId', removeMember);
adminRouter.post('/remove', removeProject);

export default adminRouter;

