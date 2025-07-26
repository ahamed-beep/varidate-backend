import express from 'express';
import multer from 'multer';
import {
  signupcontroller,
  logincontroller,
  verifyCodeController,
  resendVerificationCode,
  forgotPasswordController,
  resetPasswordController
} from '../Controller/usercontroller.js';
import { createProfile, getallprofiledata, getProfileById, getProfilePicture, getPublicProfiles, updateAllBadgeScores } from '../Controller/personalprofilecontroller.js';

const userroutes = express.Router();

// 🧠 Multer memory storage (no file size limit)
const storage = multer.memoryStorage();

// ✅ Expanded file type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg', // ✅ Allow .jpg explicitly
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, JPEG, and PNG are allowed.'), false);
  }
};

// ✅ No file size limit, file count still controlled via maxCount in upload.fields
const upload = multer({
  storage,
  fileFilter
});

// 🔐 Auth routes
userroutes.post('/post', signupcontroller);
userroutes.post('/login', logincontroller);
userroutes.post('/verify-code', verifyCodeController);
userroutes.post('/resend-code', resendVerificationCode);
userroutes.post('/forgot-password', forgotPasswordController);
userroutes.post('/reset-password', resetPasswordController);

userroutes.get('/profile/:userId', getallprofiledata);


// 📝 Profile submission route
userroutes.post(
  '/profile',
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'education[0][degreeFile]', maxCount: 1 },
    { name: 'experience[0][experienceFile]', maxCount: 1 }
  ]),
  createProfile
);

userroutes.get('/profile', getPublicProfiles);
userroutes.get('/:userId/picture', getProfilePicture);

userroutes.get('/profiledetail/:id', getProfileById);
// Update the existing route
userroutes.patch('/update-badge-score/:id', updateAllBadgeScores);









export default userroutes;

