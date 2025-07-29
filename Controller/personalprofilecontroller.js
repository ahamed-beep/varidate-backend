import uploadToCloudinary from "../Middleware/Cloudinaryuploader.js";
import mongoose from 'mongoose';
import ProfileModel from "../Model/profilesubmission.js";
import _ from "lodash";
import fs from 'fs';
import path from 'path';



export const createProfile = async (req, res) => {
  try {
    console.log('Received files:', req.files);
    console.log('Received body:', req.body);

    // Validate required fields
  const requiredFields = [
  'userId', 'name', 'mobile', 'email', 'cnic', 'fatherName',
  'city', 'country', 'gender', 'dob', 'nationality',
  'residentStatus', 'maritalStatus' // ← Included here ✅
];

    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Process main files
    const [profilePicture, resume] = await Promise.all([
      req.files?.profilePicture
        ? await uploadToCloudinary(req.files.profilePicture.path, 'profile_images')
        : null,
      req.files?.resume
        ? await uploadToCloudinary(req.files.resume.path, 'resumes')
        : null
    ]);

    if (!profilePicture || !resume) {
      return res.status(400).json({
        success: false,
        message: 'Profile picture and resume are required'
      });
    }

    // Process shiftPreferences array - FIXED
    let shiftPreferences = [];
    if (req.body['shiftPreferences[0]']) {
      // Handle array fields sent as indexed parameters
      shiftPreferences = Object.keys(req.body)
        .filter(key => key.startsWith('shiftPreferences['))
        .sort((a, b) => {
          const indexA = parseInt(a.match(/\[(\d+)\]/)[1]);
          const indexB = parseInt(b.match(/\[(\d+)\]/)[1]);
          return indexA - indexB;
        })
        .map(key => req.body[key]);
    } else if (req.body.shiftPreferences && Array.isArray(req.body.shiftPreferences)) {
      shiftPreferences = req.body.shiftPreferences;
    }

    // Process workAuthorization array - FIXED
    let workAuthorization = [];
    if (req.body['workAuthorization[0]']) {
      workAuthorization = Object.keys(req.body)
        .filter(key => key.startsWith('workAuthorization['))
        .sort((a, b) => {
          const indexA = parseInt(a.match(/\[(\d+)\]/)[1]);
          const indexB = parseInt(b.match(/\[(\d+)\]/)[1]);
          return indexA - indexB;
        })
        .map(key => req.body[key]);
    } else if (req.body.workAuthorization && Array.isArray(req.body.workAuthorization)) {
      workAuthorization = req.body.workAuthorization;
    }

    // Process education array
    const education = [];
    if (!req.body.education || (Array.isArray(req.body.education) && req.body.education.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'At least one education entry is required'
      });
    }

    const educationArray = Array.isArray(req.body.education) 
      ? req.body.education 
      : [req.body.education];

    for (const [index, edu] of educationArray.entries()) {
      if (!edu) continue;
      
      if (!edu.degreeTitle || !edu.institute || !edu.startDate) {
        return res.status(400).json({
          success: false,
          message: `Education entry ${index + 1} is missing required fields`
        });
      }

      const degreeFile = req.files?.education?.[index]?.degreeFile
        ? await uploadToCloudinary(
            req.files.education[index].degreeFile.path,
            'education_files'
          )
        : null;

      if (!degreeFile) {
        return res.status(400).json({
          success: false,
          message: `Degree file is required for education entry ${index + 1}`
        });
      }

      education.push({
        degreeTitle: edu.degreeTitle,
        degreeTitleVisibility: 'Public',
        institute: edu.institute,
        instituteVisibility: 'Public',
        website: edu.website || '',
        websiteVisibility: 'Public',
        startDate: new Date(edu.startDate),
        startDateVisibility: 'Public',
        endDate: edu.endDate ? new Date(edu.endDate) : null,
        endDateVisibility: 'Public',
        degreeFile,
        degreeFileVisibility: 'Public',
        verificationLevel: "Silver",
        degreeTitleBadge: "Black",
        degreeTitleBadgeScore: 0,
        instituteBadge: "Black",
        instituteBadgeScore: 0,
        startDateBadge: "Black",
        startDateBadgeScore: 0,
        endDateBadge: "Black",
        endDateBadgeScore: 0,
        degreeFileBadge: "Black",
        degreeFileBadgeScore: 0,
        websiteBadge: "Black",
        websiteBadgeScore: 0
      });
    }

    // Process experience array
    const experience = [];
    if (!req.body.experience || (Array.isArray(req.body.experience) && req.body.experience.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'At least one experience entry is required'
      });
    }

    const experienceArray = Array.isArray(req.body.experience) 
      ? req.body.experience 
      : [req.body.experience];

    for (const [index, exp] of experienceArray.entries()) {
      if (!exp) continue;
      
      if (!exp.jobTitle || !exp.company || !exp.industry || !exp.startDate) {
        return res.status(400).json({
          success: false,
          message: `Experience entry ${index + 1} is missing required fields`
        });
      }

      const experienceFile = req.files?.experience?.[index]?.experienceFile
        ? await uploadToCloudinary(
            req.files.experience[index].experienceFile.path,
            'experience_files'
          )
        : null;

      if (!experienceFile) {
        return res.status(400).json({
          success: false,
          message: `Experience file is required for experience entry ${index + 1}`
        });
      }

      // Handle jobFunctions array - FIXED
      let jobFunctions = [];
      if (exp['jobFunctions][0'] || exp['jobFunctions][1']) {
        // Handle array fields sent as indexed parameters
        jobFunctions = Object.keys(exp)
          .filter(key => key.startsWith('jobFunctions]['))
          .sort((a, b) => {
            const indexA = parseInt(a.match(/\]\[(\d+)/)[1]);
            const indexB = parseInt(b.match(/\]\[(\d+)/)[1]);
            return indexA - indexB;
          })
          .map(key => exp[key]);
      } else if (exp.jobFunctions && Array.isArray(exp.jobFunctions)) {
        jobFunctions = exp.jobFunctions;
      }

      experience.push({
        jobTitle: exp.jobTitle,
        jobTitleVisibility: 'Public',
        company: exp.company,
        companyVisibility: 'Public',
        website: exp.website || '',
        websiteVisibility: 'Public',
        startDate: new Date(exp.startDate),
        startDateVisibility: 'Public',
        endDate: exp.endDate ? new Date(exp.endDate) : null,
        endDateVisibility: 'Public',
        jobFunctions,
        jobFunctionsVisibility: 'Public',
        industry: exp.industry,
        industryVisibility: 'Public',
        experienceFile,
        experienceFileVisibility: 'Public',
        verificationLevel: "Silver",
        jobTitleBadge: "Black",
        jobTitleBadgeScore: 0,
        companyBadge: "Black",
        companyBadgeScore: 0,
        startDateBadge: "Black",
        startDateBadgeScore: 0,
        endDateBadge: "Black",
        endDateBadgeScore: 0,
        jobFunctionsBadge: "Black",
        jobFunctionsBadgeScore: 0,
        industryBadge: "Black",
        industryBadgeScore: 0,
        websiteBadge: "Black",
        websiteBadgeScore: 0,
        experienceFileBadge: "Black",
        experienceFileBadgeScore: 0
      });
    }

    // Prepare complete profile data with all fields
    const profileData = {
      userId: req.body.userId,
      name: req.body.name,
      nameVisibility: 'Public',
      nameBadge: "Black",
      nameBadgeScore: 0,
      fatherName: req.body.fatherName,
      fatherNameVisibility: 'Public',
      fatherNameBadge: "Black",
      fatherNameBadgeScore: 0,
      gender: req.body.gender,
      genderVisibility: 'Public',
      genderBadge: "Black",
      genderBadgeScore: 0,
      dob: new Date(req.body.dob),
      dobVisibility: 'Public',
      dobBadge: "Black",
      dobBadgeScore: 0,
      cnic: req.body.cnic,
      cnicVisibility: 'Public',
      cnicBadge: "Black",
      cnicBadgeScore: 0,
      profilePicture,
      profilePictureVisibility: 'Public',
      profilePictureBadge: "Black",
      profilePictureBadgeScore: 0,
      mobile: req.body.mobile,
      mobileVisibility: 'Public',
      mobileBadge: "Black",
      mobileBadgeScore: 0,
      email: req.body.email,
      emailVisibility: 'Public',
      emailBadge: "Black",
      emailBadgeScore: 0,
      address: req.body.address || '',
      addressVisibility: 'Public',
      addressBadge: "Black",
      addressBadgeScore: 0,
      city: req.body.city,
      cityVisibility: 'Public',
      cityBadge: "Black",
      cityBadgeScore: 0,
      country: req.body.country,
      countryVisibility: 'Public',
      countryBadge: "Black",
      countryBadgeScore: 0,
      nationality: req.body.nationality,
      nationalityVisibility: 'Public',
      nationalityBadge: "Black",
      nationalityBadgeScore: 0,
      residentStatus: req.body.residentStatus,
      residentStatusVisibility: 'Public',
      residentStatusBadge: "Black",
      residentStatusBadgeScore: 0,
      maritalStatus: req.body.maritalStatus,
      maritalStatusVisibility: 'Public',
      maritalStatusBadge: "Black",
      maritalStatusBadgeScore: 0,
      shiftPreferences, // Now properly populated
      shiftPreferencesVisibility: 'Public',
      shiftPreferencesBadge: "Black",
      shiftPreferencesBadgeScore: 0,
      workLocationPreference: req.body.workLocationPreference || '',
      workLocationPreferenceVisibility: 'Public',
      workLocationPreferenceBadge: "Black",
      workLocationPreferenceBadgeScore: 0,
      workAuthorization, // Now properly populated
      workAuthorizationVisibility: 'Public',
      workAuthorizationBadge: "Black",
      workAuthorizationBadgeScore: 0,
      resume,
      resumeVisibility: 'Public',
      resumeBadge: "Black",
      resumeBadgeScore: 0,
      education,
      experience, // Now includes properly populated jobFunctions
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create or update profile
    let profile;
    if (req.body.profileId) {
      profile = await ProfileModel.findByIdAndUpdate(
        req.body.profileId,
        profileData,
        { new: true, runValidators: true }
      );
    } else {
      profile = new ProfileModel(profileData);
      await profile.save();
    }

    res.status(201).json({
      success: true,
      message: "Profile saved successfully",
      data: profile
    });

  } catch (error) {
    console.error("Profile creation error:", error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages
      });
    }

    // Handle Cloudinary errors
    if (error.message.includes('Cloudinary')) {
      return res.status(400).json({
        success: false,
        message: "File upload error",
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to save profile",
      error: error.message
    });
  }
};



export const getProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const profile = await ProfileModel.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};

// Add this to your personalprofilecontroller.js

// Fixed updateProfile function in personalprofilecontroller.js

// Fixed updateProfile function in personalprofilecontroller.js

export const updateProfile = async (req, res) => {
  try {
    console.log("Request origin:", req.headers.origin);
    console.log("Received files:", req.files ? Object.keys(req.files) : 'No files');
    console.log("Received body keys:", Object.keys(req.body));
    console.log("Full body:", JSON.stringify(req.body, null, 2));

    const { userId, profileId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Find existing profile
    const existingProfile = await ProfileModel.findOne({ 
      $or: [
        { _id: profileId },
        { userId: userId }
      ]
    });

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    // Prepare update data
    const updateData = { ...req.body };
    delete updateData.profileId; // Remove profileId from update data

    // Handle file uploads
    const fileFields = ['profilePicture', 'resume'];
    for (const field of fileFields) {
      if (req.files && req.files[field]) {
        try {
          const uploadedUrl = await uploadToCloudinary(req.files[field].path, `${field}_files`);
          updateData[field] = uploadedUrl;
        } catch (uploadError) {
          console.error(`Error uploading ${field}:`, uploadError);
          return res.status(500).json({
            success: false,
            message: `Failed to upload ${field}`
          });
        }
      }
    }

    // Process education array
    if (req.body.education && Array.isArray(req.body.education)) {
      updateData.education = await Promise.all(
        req.body.education.map(async (edu, index) => {
          const educationData = { ...edu };
          
          // Handle degree file
          if (req.files && req.files.education && req.files.education[index] && req.files.education[index].degreeFile) {
            try {
              const uploadedUrl = await uploadToCloudinary(
                req.files.education[index].degreeFile.path, 
                'degree_files'
              );
              educationData.degreeFile = uploadedUrl;
            } catch (uploadError) {
              console.error(`Error uploading degree file for education ${index}:`, uploadError);
              throw new Error(`Failed to upload degree file for education ${index}`);
            }
          } else if (edu.degreeFileUrl) {
            // Keep existing file URL
            educationData.degreeFile = edu.degreeFileUrl;
          } else if (existingProfile.education && existingProfile.education[index] && existingProfile.education[index].degreeFile) {
            // Preserve existing file if no new file provided
            educationData.degreeFile = existingProfile.education[index].degreeFile;
          }

          // Clean up URL field
          delete educationData.degreeFileUrl;

          // Ensure all required fields have defaults
          educationData.degreeTitleVisibility = educationData.degreeTitleVisibility || 'Public';
          educationData.instituteVisibility = educationData.instituteVisibility || 'Public';
          educationData.startDateVisibility = educationData.startDateVisibility || 'Public';
          educationData.endDateVisibility = educationData.endDateVisibility || 'Public';
          educationData.websiteVisibility = educationData.websiteVisibility || 'Public';
          educationData.degreeFileVisibility = educationData.degreeFileVisibility || 'Public';
          educationData.verificationLevel = educationData.verificationLevel || 'Silver';

          return educationData;
        })
      );
    }

    // Process experience array
    if (req.body.experience && Array.isArray(req.body.experience)) {
      updateData.experience = await Promise.all(
        req.body.experience.map(async (exp, index) => {
          const experienceData = { ...exp };
          
          // Ensure jobFunctions is an array
          if (!Array.isArray(experienceData.jobFunctions)) {
            experienceData.jobFunctions = [];
          }

          // Handle experience file
          if (req.files && req.files.experience && req.files.experience[index] && req.files.experience[index].experienceFile) {
            try {
              const uploadedUrl = await uploadToCloudinary(
                req.files.experience[index].experienceFile.path, 
                'experience_files'
              );
              experienceData.experienceFile = uploadedUrl;
            } catch (uploadError) {
              console.error(`Error uploading experience file for experience ${index}:`, uploadError);
              throw new Error(`Failed to upload experience file for experience ${index}`);
            }
          } else if (exp.experienceFileUrl) {
            // Keep existing file URL
            experienceData.experienceFile = exp.experienceFileUrl;
          } else if (existingProfile.experience && existingProfile.experience[index] && existingProfile.experience[index].experienceFile) {
            // Preserve existing file if no new file provided
            experienceData.experienceFile = existingProfile.experience[index].experienceFile;
          }

          // Clean up URL field
          delete experienceData.experienceFileUrl;

          // Ensure all required fields have defaults
          experienceData.jobTitleVisibility = experienceData.jobTitleVisibility || 'Public';
          experienceData.companyVisibility = experienceData.companyVisibility || 'Public';
          experienceData.startDateVisibility = experienceData.startDateVisibility || 'Public';
          experienceData.endDateVisibility = experienceData.endDateVisibility || 'Public';
          experienceData.websiteVisibility = experienceData.websiteVisibility || 'Public';
          experienceData.experienceFileVisibility = experienceData.experienceFileVisibility || 'Public';
          experienceData.jobFunctionsVisibility = experienceData.jobFunctionsVisibility || 'Public';
          experienceData.industryVisibility = experienceData.industryVisibility || 'Public';
          experienceData.verificationLevel = experienceData.verificationLevel || 'Silver';

          return experienceData;
        })
      );
    }

    // Convert string arrays back to arrays for shift preferences and work authorization
    if (typeof updateData.shiftPreferences === 'string') {
      updateData.shiftPreferences = [updateData.shiftPreferences];
    }
    if (typeof updateData.workAuthorization === 'string') {
      updateData.workAuthorization = [updateData.workAuthorization];
    }

    // Handle array fields that come as indexed keys
    const processArrayFields = (data, fieldName) => {
      const arrayItems = [];
      Object.keys(data).forEach(key => {
        const match = key.match(new RegExp(`${fieldName}\\[(\\d+)\\]`));
        if (match) {
          const index = parseInt(match[1]);
          arrayItems[index] = data[key];
          delete data[key];
        }
      });
      if (arrayItems.length > 0) {
        data[fieldName] = arrayItems.filter(item => item !== undefined);
      }
    };

    processArrayFields(updateData, 'shiftPreferences');
    processArrayFields(updateData, 'workAuthorization');

    // Update the profile
    console.log('About to update profile with data:', JSON.stringify({
      education: updateData.education?.length || 0,
      experience: updateData.experience?.length || 0,
      hasFiles: Object.keys(updateData).filter(key => key.includes('File') || key === 'profilePicture' || key === 'resume')
    }, null, 2));

    const updatedProfile = await ProfileModel.findByIdAndUpdate(
      existingProfile._id,
      updateData,
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Failed to update profile"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile
    });

  } catch (error) {
    console.error("Profile update error:", error);
    console.error("Error stack:", error.stack);
    
    // Log validation errors specifically
    if (error.name === 'ValidationError') {
      console.error("Validation errors:", error.errors);
    }
    
    // Clean up uploaded files on error
    if (req.files) {
      const cleanupFiles = (filesObj) => {
        if (Array.isArray(filesObj)) {
          filesObj.forEach(fileArray => {
            if (Array.isArray(fileArray)) {
              fileArray.forEach(file => {
                if (file && file.path && fs.existsSync(file.path)) {
                  fs.unlinkSync(file.path);
                }
              });
            } else if (fileArray && typeof fileArray === 'object') {
              Object.values(fileArray).forEach(file => {
                if (file && file.path && fs.existsSync(file.path)) {
                  fs.unlinkSync(file.path);
                }
              });
            }
          });
        } else if (filesObj && filesObj.path && fs.existsSync(filesObj.path)) {
          fs.unlinkSync(filesObj.path);
        }
      };

      Object.values(req.files).forEach(cleanupFiles);
    }

    res.status(400).json({
      success: false,
      message: error.message || "Failed to update profile",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      validationErrors: error.name === 'ValidationError' ? error.errors : undefined
    });
  }
};




export const getPublicProfiles = async (req, res) => {
  try {
    const allProfiles = await ProfileModel.find({});
    
    const publicProfiles = allProfiles.map(profile => {
      const publicProfile = { _id: profile._id };
      
      // Process top-level fields
      const fields = Object.keys(profile.toObject());
      fields.forEach(field => {
        if (field.endsWith('Visibility') || field.endsWith('Badge') || field.startsWith('_')) return;
        
        const visibilityField = `${field}Visibility`;
        if (profile[visibilityField] === 'Public') {
          publicProfile[field] = profile[field];
        }
      });

      // Process education array - modified to be less aggressive
      if (profile.education && profile.education.length > 0) {
        publicProfile.education = profile.education.map(edu => {
          const publicEdu = {};
          let hasPublicFields = false;
          
          Object.keys(edu).forEach(key => {
            if (!key.endsWith('Visibility') && !key.endsWith('Badge') && key !== '_id') {
              const visibility = edu[`${key}Visibility`];
              // If visibility is undefined or Public, include the field
              if (!visibility || visibility === 'Public') {
                publicEdu[key] = edu[key];
                hasPublicFields = true;
              }
            }
          });
          
          return hasPublicFields ? publicEdu : null;
        }).filter(edu => edu !== null); 
      }

      // Process experience array - modified to be less aggressive
      if (profile.experience && profile.experience.length > 0) {
        publicProfile.experience = profile.experience.map(exp => {
          const publicExp = {};
          let hasPublicFields = false;
          
          Object.keys(exp).forEach(key => {
            if (!key.endsWith('Visibility') && !key.endsWith('Badge') && key !== '_id') {
              const visibility = exp[`${key}Visibility`];
              // If visibility is undefined or Public, include the field
              if (!visibility || visibility === 'Public') {
                publicExp[key] = exp[key];
                hasPublicFields = true;
              }
            }
          });
          
          return hasPublicFields ? publicExp : null;
        }).filter(exp => exp !== null);
      }

      return publicProfile;
    }).filter(profile => {
      // Keep profile if it has at least one public field besides _id
      return Object.keys(profile).length > 1 || 
             (profile.education && profile.education.length > 0) ||
             (profile.experience && profile.experience.length > 0);
    });

    return res.status(200).json({
      success: true,
      profiles: publicProfiles
    });
  } catch (error) {
    console.error("Error getting public profiles:", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


export const getProfileById = async (req, res) => {
  try {
    const profile = await ProfileModel.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({
      success: true,
      profile, // 🔥 send full profile object
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



export const getProfilePicture = async (req , res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find the profile but only select the profilePicture and its visibility fields
    const profile = await ProfileModel.findOne(
      { userId },
      { 
        profilePicture: 1,
        profilePictureVisibility: 1,
        _id: 0 // Exclude the _id field from results
      }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Check if the profile picture is visible
    if (profile.profilePictureVisibility === "Hide") {
      return res.status(403).json({ message: "Profile picture is hidden" });
    }

    // Return the profile picture URL
    res.status(200).json({
      profilePicture: profile.profilePicture,
      visibility: profile.profilePictureVisibility
    });

  } catch (error) {
    console.error("Error fetching profile picture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const BADGE_THRESHOLDS = [
  { name: "Platinum", threshold: 20 },
  { name: "Gold", threshold: 10 },     // Gold at 10 (instead of 15)
  { name: "Silver", threshold: 5 },    // Silver at 5 (instead of 10)
  { name: "Black", threshold: 0 }
  
];

const getBadgeFromScore = (score) => {
  const numericScore = Number(score); // Ensure it's a number
  for (const badge of BADGE_THRESHOLDS) {
    if (numericScore >= badge.threshold) {
      return badge.name;
    }
  }
  return "Black"; // Fallback
};

export const updateAllBadgeScores = async (req, res) => {
  try {
    const { id } = req.params;
    const { voterId, ...votes } = req.body;

    if (!voterId) {
      return res.status(400).json({ success: false, error: "Voter ID is required to cast votes." });
    }
    if (!mongoose.Types.ObjectId.isValid(voterId)) {
        return res.status(400).json({ success: false, error: "Invalid voter ID format." });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid profile ID format" });
    }

    const profile = await ProfileModel.findById(id);
    if (!profile) {
      return res.status(404).json({ success: false, error: "Profile not found" });
    }

    const updates = { $inc: {}, $set: {}, $addToSet: {} };
    const errors = [];
    const modifiedFields = [];
    const skippedFields = [];

    for (const [field, vote] of Object.entries(votes)) {
      if (vote !== "yes" && vote !== "no") {
        errors.push(`Invalid vote value for ${field}. Must be 'yes' or 'no'.`);
        continue;
      }

      const increment = vote === "yes" ? 1 : 0;
      let scorePath, badgePath, votedByPath;

      if (field.includes('-')) {
        const [type, subField, index] = field.split('-');
        const arrayField = type === 'edu' ? 'education' : 'experience';

        if (!profile[arrayField]?.[index]) {
          errors.push(`Subdocument at index ${index} for ${arrayField} not found for field ${field}.`);
          continue;
        }

        scorePath = `${arrayField}.${index}.${subField}BadgeScore`;
        badgePath = `${arrayField}.${index}.${subField}Badge`;
        votedByPath = `${arrayField}.${index}.${subField}VotedBy`;
      } else {
        const baseField = field.replace('BadgeScore', '');
        scorePath = `${baseField}BadgeScore`;
        badgePath = `${baseField}Badge`;
        votedByPath = `${baseField}VotedBy`;
      }

      const currentScore = _.get(profile, scorePath, 0);
      if (typeof currentScore !== 'number') {
        errors.push(`Current score for ${scorePath} is not a valid number.`);
        continue;
      }

      const currentVotedBy = _.get(profile, votedByPath, []);
      if (currentVotedBy.map(String).includes(voterId.toString())) {
        skippedFields.push(field);
        errors.push(`Voter ${voterId} has already cast a vote for ${field}.`);
        continue;
      }

      const newScore = currentScore + increment;

      updates.$inc[scorePath] = (updates.$inc[scorePath] || 0) + increment;
      updates.$set[badgePath] = getBadgeFromScore(newScore);
      updates.$addToSet[votedByPath] = voterId;

      modifiedFields.push(field);
    }

    if (Object.keys(updates.$inc).length === 0) delete updates.$inc;
    if (Object.keys(updates.$set).length === 0) delete updates.$set;
    if (Object.keys(updates.$addToSet).length === 0) delete updates.$addToSet;

    if (Object.keys(updates.$inc || {}).length === 0 &&
        Object.keys(updates.$set || {}).length === 0 &&
        Object.keys(updates.$addToSet || {}).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update or all provided fields already voted on by this user.",
        errors
      });
    }

    const updatedProfile = await ProfileModel.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Badge scores updated successfully",
      data: updatedProfile,
      modifiedFields,
      skippedFields,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};





export const getallprofiledata = async(req , res)=>{
 try {
    const { userId } = req.params;

    const profile = await ProfileModel.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json(profile); // send entire raw profile doc
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
}
