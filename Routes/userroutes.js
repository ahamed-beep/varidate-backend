import express from 'express'
import { forgotPasswordController, logincontroller, resendVerificationCode, resetPasswordController, signupcontroller, verifyCodeController} from '../Controller/usercontroller.js';

const userroutes = express.Router();

userroutes.route('/post').post(signupcontroller);
userroutes.route('/login').post(logincontroller);
userroutes.route('/verify-code').post(verifyCodeController);
userroutes.route('/verify-code').post(verifyCodeController);
userroutes.route('/forgot-password').post(forgotPasswordController);
userroutes.route('/reset-password').post(resetPasswordController);



export default userroutes;
