import express from 'express'
import { redLightIntensity } from '../controller/UserController.js';


const userRouter = express.Router();

userRouter.get('/red-light',redLightIntensity);

export default userRouter;
