import express from 'express'
const userRouter = express.Router();
import {registerUser, loginUser, createProject,getUser, myProjects, getName, ListProjects, updateProject} from '../controllers/userController.js'

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/createProject', createProject);
userRouter.get('/myProject', myProjects);
userRouter.get('/getname', getName);
userRouter.get('/listprojects', ListProjects);
userRouter.get('/:name', getUser);
userRouter.put('/project/update', updateProject);


export default userRouter;