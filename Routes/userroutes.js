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
  getProfileByUserId, 
  getProfilePicture, 
  getPublicProfiles, 
  updateAllBadgeScores,
  updateProfile
} from '../Controller/personalprofilecontroller.js';

const userroutes = express.Router();

// Custom middleware to handle multipart form data
// Fixed multipart form parser in userroutes.js

// Enhanced multipart form parser with better debugging
const handleMultipartForm = (req, res, next) => {
  const form = new multiparty.Form();
  
  form.parse(req, function(err, fields, files) {
    if (err) {
      console.error('Multipart parsing error:', err);
      return res.status(400).json({
        success: false,
        message: 'Error parsing form data',
        error: err.message
      });
    }

    console.log('Raw fields received:', Object.keys(fields));
    console.log('Raw files received:', Object.keys(files));

    // Initialize request objects
    req.body = {};
    req.files = {};

    // Process fields
    for (const [key, value] of Object.entries(fields)) {
      const fieldValue = Array.isArray(value) ? value[0] : value;
      
      // Handle nested array fields like education[0][degreeTitle]
      if (key.includes('[') && key.includes(']')) {
        const parts = key.match(/^([^[]+)(?:\[(\d+)\])?(?:\[([^[]+)\])?(?:\[(\d+)\])?/);
        
        if (parts) {
          const [, mainField, index1, subField, index2] = parts;
          
          if (index1 !== undefined && subField && index2 !== undefined) {
            // Handle nested arrays like experience[0][jobFunctions][0]
            if (!req.body[mainField]) req.body[mainField] = [];
            if (!req.body[mainField][parseInt(index1)]) req.body[mainField][parseInt(index1)] = {};
            if (!req.body[mainField][parseInt(index1)][subField]) req.body[mainField][parseInt(index1)][subField] = [];
            req.body[mainField][parseInt(index1)][subField][parseInt(index2)] = fieldValue;
          } else if (index1 !== undefined && subField) {
            // Handle single level arrays like education[0][degreeTitle]
            if (!req.body[mainField]) req.body[mainField] = [];
            if (!req.body[mainField][parseInt(index1)]) req.body[mainField][parseInt(index1)] = {};
            req.body[mainField][parseInt(index1)][subField] = fieldValue;
          } else if (index1 !== undefined) {
            // Handle simple arrays like shiftPreferences[0]
            if (!req.body[mainField]) req.body[mainField] = [];
            req.body[mainField][parseInt(index1)] = fieldValue;
          }
        }
      } else {
        // Handle regular fields
        req.body[key] = fieldValue;
      }
    }

    // Process files
    for (const [key, fileArray] of Object.entries(files)) {
      const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;
      
      if (key.includes('[') && key.includes(']')) {
        const parts = key.match(/^([^[]+)\[(\d+)\]\[([^[]+)\]/);
        if (parts) {
          const [, section, index, field] = parts;
          if (!req.files[section]) req.files[section] = [];
          if (!req.files[section][parseInt(index)]) req.files[section][parseInt(index)] = {};
          req.files[section][parseInt(index)][field] = file;
        }
      } else {
        req.files[key] = file;
      }
    }

    // Clean up arrays - remove undefined elements
    ['education', 'experience'].forEach(section => {
      if (req.body[section] && Array.isArray(req.body[section])) {
        req.body[section] = req.body[section].filter(item => item !== undefined);
        
        // Clean up nested arrays within each item
        req.body[section].forEach(item => {
          if (item && typeof item === 'object') {
            Object.keys(item).forEach(key => {
              if (Array.isArray(item[key])) {
                item[key] = item[key].filter(val => val !== undefined && val !== null && val !== '');
              }
            });
          }
        });
      }
    });

    // Clean up other arrays
    ['shiftPreferences', 'workAuthorization'].forEach(field => {
      if (req.body[field] && Array.isArray(req.body[field])) {
        req.body[field] = req.body[field].filter(item => item !== undefined && item !== null && item !== '');
      }
    });

    console.log('Processed body:', JSON.stringify(req.body, null, 2));
    console.log('Processed files:', Object.keys(req.files));

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
userroutes.post('/profile', handleMultipartForm, createProfile); // Create new profile
userroutes.put('/profile', handleMultipartForm, updateProfile); // Update existing profile
userroutes.get('/profile/user/:userId', getProfileByUserId);
userroutes.get('/profile', getPublicProfiles);
userroutes.get('/:userId/picture', getProfilePicture);
userroutes.get('/profiledetail/:id', getProfileById);
userroutes.patch('/update-badge-score/:id', updateAllBadgeScores);

export default userroutes;