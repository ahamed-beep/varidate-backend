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
import { createProfile } from '../Controller/personalprofilecontroller.js';

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
userroutes.post('/signup', signupcontroller);
userroutes.post('/login', logincontroller);
userroutes.post('/verify-code', verifyCodeController);
userroutes.post('/resend-code', resendVerificationCode);
userroutes.post('/forgot-password', forgotPasswordController);
userroutes.post('/reset-password', resetPasswordController);

// 📝 Profile submission route
userroutes.post(
  '/profile',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'cnicFile', maxCount: 1 },
    { name: 'degreeFiles', maxCount: 5 },
    { name: 'experienceFiles', maxCount: 3 }
  ]),
  (err, req, res, next) => {
    console.log('🗂️ Uploaded files:', req.files);  // ✅ Check what got uploaded
    console.log('📨 Body:', req.body);             // ✅ Check form fields

    if (err instanceof multer.MulterError) {
      console.error("📛 Multer error:", err);
      return res.status(400).json({
        success: false,
        message: err.code === 'LIMIT_FILE_SIZE'
          ? 'File size too large'
          : err.code === 'LIMIT_FILE_COUNT'
            ? 'Too many files uploaded'
            : 'File upload error (multer)'
      });
    } else if (err) {
      console.error("💥 Non-Multer file upload error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed'
      });
    }

    next();
  },
  createProfile
);

export default userroutes;
