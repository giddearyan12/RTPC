import express from 'express'
const userRouter = express.Router();
import {registerUser, loginUser, createProject, myProjects} from '../controllers/userController.js'

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/createProject', createProject);
userRouter.get('/myProject', myProjects);

export default userRouter;