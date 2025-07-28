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
      'residentStatus', 'maritalStatus'
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

export const updateProfile = async (req, res) => {
  try {
    console.log('Received files:', req.files);
    console.log('Received body:', req.body);

    const { userId, profileId } = req.body;
    
    if (!userId || !profileId) {
      return res.status(400).json({
        success: false,
        message: 'User ID and Profile ID are required'
      });
    }

    // Find the existing profile
    const existingProfile = await ProfileModel.findOne({ _id: profileId, userId });
    
    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Create an object to hold the updates
    const updates = {
      updatedAt: new Date()
    };

    // Process main files if provided
    if (req.files?.profilePicture) {
      updates.profilePicture = await uploadToCloudinary(req.files.profilePicture.path, 'profile_images');
    }

    if (req.files?.resume) {
      updates.resume = await uploadToCloudinary(req.files.resume.path, 'resumes');
    }

    // Process personal information fields
    const personalFields = [
      'name', 'mobile', 'email', 'cnic', 'fatherName',
      'city', 'country', 'gender', 'dob', 'nationality',
      'residentStatus', 'maritalStatus', 'workLocationPreference'
    ];

    personalFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'dob' && req.body[field]) {
          updates[field] = new Date(req.body[field]);
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    // Process shiftPreferences if provided
    if (req.body['shiftPreferences[0]'] || req.body.shiftPreferences) {
      let shiftPreferences = [];
      if (req.body['shiftPreferences[0]']) {
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
      updates.shiftPreferences = shiftPreferences;
    }

    // Process workAuthorization if provided
    if (req.body['workAuthorization[0]'] || req.body.workAuthorization) {
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
      updates.workAuthorization = workAuthorization;
    }

    // Process education if provided
    if (req.body.education) {
      const educationArray = Array.isArray(req.body.education) 
        ? req.body.education 
        : [req.body.education];

      updates.education = await Promise.all(educationArray.map(async (edu, index) => {
        const educationDoc = existingProfile.education.id(edu.id) || {};
        
        const degreeFile = req.files?.education?.[index]?.degreeFile
          ? await uploadToCloudinary(
              req.files.education[index].degreeFile.path,
              'education_files'
            )
          : educationDoc.degreeFile;

        return {
          _id: edu.id || educationDoc._id || new mongoose.Types.ObjectId(),
          degreeTitle: edu.degreeTitle || educationDoc.degreeTitle,
          institute: edu.institute || educationDoc.institute,
          startDate: edu.startDate ? new Date(edu.startDate) : educationDoc.startDate,
          endDate: edu.endDate ? new Date(edu.endDate) : educationDoc.endDate,
          website: edu.website || educationDoc.website,
          degreeFile,
          // Keep existing visibility and badge settings if not provided
          degreeTitleVisibility: edu.degreeTitleVisibility || educationDoc.degreeTitleVisibility || 'Public',
          instituteVisibility: edu.instituteVisibility || educationDoc.instituteVisibility || 'Public',
          startDateVisibility: edu.startDateVisibility || educationDoc.startDateVisibility || 'Public',
          endDateVisibility: edu.endDateVisibility || educationDoc.endDateVisibility || 'Public',
          websiteVisibility: edu.websiteVisibility || educationDoc.websiteVisibility || 'Public',
          degreeFileVisibility: edu.degreeFileVisibility || educationDoc.degreeFileVisibility || 'Public',
          verificationLevel: edu.verificationLevel || educationDoc.verificationLevel || 'Silver',
          // Badges - preserve existing if not provided
          degreeTitleBadge: edu.degreeTitleBadge || educationDoc.degreeTitleBadge || 'Black',
          degreeTitleBadgeScore: edu.degreeTitleBadgeScore || educationDoc.degreeTitleBadgeScore || 0,
          instituteBadge: edu.instituteBadge || educationDoc.instituteBadge || 'Black',
          instituteBadgeScore: edu.instituteBadgeScore || educationDoc.instituteBadgeScore || 0,
          startDateBadge: edu.startDateBadge || educationDoc.startDateBadge || 'Black',
          startDateBadgeScore: edu.startDateBadgeScore || educationDoc.startDateBadgeScore || 0,
          endDateBadge: edu.endDateBadge || educationDoc.endDateBadge || 'Black',
          endDateBadgeScore: edu.endDateBadgeScore || educationDoc.endDateBadgeScore || 0,
          degreeFileBadge: edu.degreeFileBadge || educationDoc.degreeFileBadge || 'Black',
          degreeFileBadgeScore: edu.degreeFileBadgeScore || educationDoc.degreeFileBadgeScore || 0,
          websiteBadge: edu.websiteBadge || educationDoc.websiteBadge || 'Black',
          websiteBadgeScore: edu.websiteBadgeScore || educationDoc.websiteBadgeScore || 0
        };
      }));
    }

    // Process experience if provided
    if (req.body.experience) {
      const experienceArray = Array.isArray(req.body.experience) 
        ? req.body.experience 
        : [req.body.experience];

      updates.experience = await Promise.all(experienceArray.map(async (exp, index) => {
        const experienceDoc = existingProfile.experience.id(exp.id) || {};
        
        const experienceFile = req.files?.experience?.[index]?.experienceFile
          ? await uploadToCloudinary(
              req.files.experience[index].experienceFile.path,
              'experience_files'
            )
          : experienceDoc.experienceFile;

        // Handle jobFunctions array
        let jobFunctions = [];
        if (exp['jobFunctions][0'] || exp['jobFunctions][1']) {
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
        } else {
          jobFunctions = experienceDoc.jobFunctions || [];
        }

        return {
          _id: exp.id || experienceDoc._id || new mongoose.Types.ObjectId(),
          jobTitle: exp.jobTitle || experienceDoc.jobTitle,
          company: exp.company || experienceDoc.company,
          startDate: exp.startDate ? new Date(exp.startDate) : experienceDoc.startDate,
          endDate: exp.endDate ? new Date(exp.endDate) : experienceDoc.endDate,
          website: exp.website || experienceDoc.website,
          experienceFile,
          jobFunctions,
          industry: exp.industry || experienceDoc.industry,
          // Keep existing visibility and badge settings if not provided
          jobTitleVisibility: exp.jobTitleVisibility || experienceDoc.jobTitleVisibility || 'Public',
          companyVisibility: exp.companyVisibility || experienceDoc.companyVisibility || 'Public',
          startDateVisibility: exp.startDateVisibility || experienceDoc.startDateVisibility || 'Public',
          endDateVisibility: exp.endDateVisibility || experienceDoc.endDateVisibility || 'Public',
          websiteVisibility: exp.websiteVisibility || experienceDoc.websiteVisibility || 'Public',
          experienceFileVisibility: exp.experienceFileVisibility || experienceDoc.experienceFileVisibility || 'Public',
          jobFunctionsVisibility: exp.jobFunctionsVisibility || experienceDoc.jobFunctionsVisibility || 'Public',
          industryVisibility: exp.industryVisibility || experienceDoc.industryVisibility || 'Public',
          verificationLevel: exp.verificationLevel || experienceDoc.verificationLevel || 'Silver',
          // Badges - preserve existing if not provided
          jobTitleBadge: exp.jobTitleBadge || experienceDoc.jobTitleBadge || 'Black',
          jobTitleBadgeScore: exp.jobTitleBadgeScore || experienceDoc.jobTitleBadgeScore || 0,
          companyBadge: exp.companyBadge || experienceDoc.companyBadge || 'Black',
          companyBadgeScore: exp.companyBadgeScore || experienceDoc.companyBadgeScore || 0,
          startDateBadge: exp.startDateBadge || experienceDoc.startDateBadge || 'Black',
          startDateBadgeScore: exp.startDateBadgeScore || experienceDoc.startDateBadgeScore || 0,
          endDateBadge: exp.endDateBadge || experienceDoc.endDateBadge || 'Black',
          endDateBadgeScore: exp.endDateBadgeScore || experienceDoc.endDateBadgeScore || 0,
          jobFunctionsBadge: exp.jobFunctionsBadge || experienceDoc.jobFunctionsBadge || 'Black',
          jobFunctionsBadgeScore: exp.jobFunctionsBadgeScore || experienceDoc.jobFunctionsBadgeScore || 0,
          industryBadge: exp.industryBadge || experienceDoc.industryBadge || 'Black',
          industryBadgeScore: exp.industryBadgeScore || experienceDoc.industryBadgeScore || 0,
          websiteBadge: exp.websiteBadge || experienceDoc.websiteBadge || 'Black',
          websiteBadgeScore: exp.websiteBadgeScore || experienceDoc.websiteBadgeScore || 0,
          experienceFileBadge: exp.experienceFileBadge || experienceDoc.experienceFileBadge || 'Black',
          experienceFileBadgeScore: exp.experienceFileBadgeScore || experienceDoc.experienceFileBadgeScore || 0
        };
      }));
    }

    // Update the profile with only the provided fields
    const updatedProfile = await ProfileModel.findByIdAndUpdate(
      profileId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile
    });

  } catch (error) {
    console.error("Profile update error:", error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages
      });
    }

    if (error.message.includes('Cloudinary')) {
      return res.status(400).json({
        success: false,
        message: "File upload error",
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message
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
    console.log("Incoming Request Body (votes):", req.body);
    const { id } = req.params;
    const votes = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid profile ID format"
      });
    }

    const profile = await ProfileModel.findById(id);
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        error: "Profile not found" 
      });
    }

    const updates = {
      $inc: {},
      $set: {}
    };
    const errors = [];
    const modifiedFields = [];

    for (const [field, vote] of Object.entries(votes)) {
      if (vote !== "yes" && vote !== "no") {
        errors.push(`Invalid vote value for ${field}`);
        continue;
      }

      const increment = vote === "yes" ? 1 : 0;
      let scorePath, badgePath;

      if (field.includes('-')) {
        const [type, subField, index] = field.split('-');
        const arrayField = type === 'edu' ? 'education' : 'experience';
        
        if (!profile[arrayField]?.[index]) {
          errors.push(`Invalid index for ${arrayField}`);
          continue;
        }

        scorePath = `${arrayField}.${index}.${subField}BadgeScore`;
        badgePath = `${arrayField}.${index}.${subField}Badge`;
      } else {
        const baseField = field.replace('BadgeScore', '');
        scorePath = `${baseField}BadgeScore`;
        badgePath = `${baseField}Badge`;
      }

      const currentScore = _.get(profile, scorePath, 0);
      if (typeof currentScore !== 'number') {
        errors.push(`Invalid numeric value for ${scorePath}`);
        continue;
      }

      const newScore = currentScore + increment;
      
      updates.$inc[scorePath] = increment;
      updates.$set[badgePath] = getBadgeFromScore(newScore);
      
      modifiedFields.push(field);

      // Debug each field update
      console.log(`Processing ${field}:`);
      console.log(`- Current Score: ${currentScore}`);
      console.log(`- New Score: ${newScore}`);
      console.log(`- Badge To Set: ${updates.$set[badgePath]}`);
      console.log(`- Score Path: ${scorePath}`);
      console.log(`- Badge Path: ${badgePath}`);
    }

    // Debug the final updates object
    console.log("Final Updates Object:", JSON.stringify(updates, null, 2));
    console.log("Score Paths Being Updated:", Object.keys(updates.$inc));
    console.log("Badge Paths Being Updated:", Object.keys(updates.$set));

    if (Object.keys(updates.$inc).length === 0 && Object.keys(updates.$set).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid fields to update",
        errors
      });
    }

    const updatedProfile = await ProfileModel.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    // Debug the returned profile
    console.log("Updated Profile:", JSON.stringify(updatedProfile, null, 2));

    return res.status(200).json({
      success: true,
      message: "Badge scores updated successfully",
      data: updatedProfile,
      modifiedFields,
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
