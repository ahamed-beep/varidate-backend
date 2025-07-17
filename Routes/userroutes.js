import express from 'express'
import { logincontroller, resendVerificationCode, signupcontroller, verifyCodeController} from '../Controller/usercontroller.js';

const userroutes = express.Router();

userroutes.route('/post').post(signupcontroller);
userroutes.route('/login').post(logincontroller);
userroutes.route('/verify-code').post(verifyCodeController);
userroutes.route('/resend-code').post(resendVerificationCode);



export default userroutes;
