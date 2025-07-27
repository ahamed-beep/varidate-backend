import express from 'express';
import multiparty from 'multiparty';
import {
  signupcontroller,
  logincontroller,
  verifyCodeController,
  resendVerificationCode,
  forgotPasswordController,
  resetPasswordController
} from '../Controller/usercontroller.js';
import { 
  createProfile, 
  getallprofiledata, 
  getProfileById, 
  getProfilePicture, 
  getPublicProfiles, 
  updateAllBadgeScores 
} from '../Controller/personalprofilecontroller.js';

const userroutes = express.Router();

// Custom middleware to handle multipart form data
const handleMultipartForm = (req, res, next) => {
  const form = new multiparty.Form();
  
  form.parse(req, function(err, fields, files) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'Error parsing form data'
      });
    }

    // Process fields
    req.body = {};
    for (const [key, value] of Object.entries(fields)) {
      // Handle array fields
      if (key.startsWith('education[') || key.startsWith('experience[')) {
        const match = key.match(/(education|experience)\[(\d+)\]\[(.+)\]/);
        if (match) {
          const [_, section, index, field] = match;
          if (!req.body[section]) req.body[section] = [];
          if (!req.body[section][index]) req.body[section][index] = {};
          req.body[section][index][field] = value[0];
        }
      } else {
        // Handle regular fields
        req.body[key] = value[0];
      }
    }

    // Process files
    req.files = {};
    for (const [key, value] of Object.entries(files)) {
      // Handle education/experience files
      if (key.startsWith('education[') || key.startsWith('experience[')) {
        const match = key.match(/(education|experience)\[(\d+)\]\[(.+)\]/);
        if (match) {
          const [_, section, index, field] = match;
          if (!req.files[section]) req.files[section] = [];
          if (!req.files[section][index]) req.files[section][index] = {};
          req.files[section][index][field] = value[0];
        }
      } else {
        // Handle regular files
        req.files[key] = value[0];
      }
    }

    // Convert education and experience to arrays if they exist
    if (req.body.education) {
      req.body.education = Object.values(req.body.education);
    }
    if (req.body.experience) {
      req.body.experience = Object.values(req.body.experience);
    }

    next();
  });
};

userroutes.use(express.json());
userroutes.use(express.urlencoded({ extended: true }));

// Auth routes
userroutes.post('/post', signupcontroller);
userroutes.post('/login', logincontroller);
userroutes.post('/verify-code', verifyCodeController);
userroutes.post('/resend-code', resendVerificationCode);
userroutes.post('/forgot-password', forgotPasswordController);
userroutes.post('/reset-password', resetPasswordController);

// Profile routes
userroutes.get('/profile/:userId', getallprofiledata);
userroutes.post('/profile', handleMultipartForm, createProfile);
userroutes.get('/profile', getPublicProfiles);
userroutes.get('/:userId/picture', getProfilePicture);
userroutes.get('/profiledetail/:id', getProfileById);
userroutes.patch('/update-badge-score/:id', updateAllBadgeScores);

export default userroutes;