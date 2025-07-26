import uploadToCloudinary from "../Middleware/Cloudinaryuploader.js";
import mongoose from 'mongoose';
import ProfileModel from "../Model/profilesubmission.js";
import _ from "lodash";




// export const createProfile = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       cnic,
//       fatherName,
//       dob,
//       gender,
//       mobile,
//       address,
//       city,
//       country,
//       userId,
//       shiftPreferences = [], // 🟢 Default to empty array if not present
//       workAuthorization = [],
//         jobFunctions = [] 
//     } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: 'userId is required.' });
//     }

//     // Parse strings to arrays if frontend sends them as comma-separated strings
//     const parsedShiftPreferences = Array.isArray(shiftPreferences)
//       ? shiftPreferences
//       : typeof shiftPreferences === 'string'
//       ? shiftPreferences.split(',').map((item) => item.trim())
//       : [];

//     const parsedWorkAuthorization = Array.isArray(workAuthorization)
//       ? workAuthorization
//       : typeof workAuthorization === 'string'
//       ? workAuthorization.split(',').map((item) => item.trim())
//       : [];
      
//   const extractedJobFunctions = Object.entries(req.body)
//   .filter(([key]) => key.startsWith('exp-jobFunctions-'))
//   .map(([_, value]) =>
//     Array.isArray(value)
//       ? value
//       : typeof value === 'string'
//       ? value.split(',').map((v) => v.trim())
//       : []
//   );

//     // ✅ Upload profile image (optional)
//     const profilePicFile = req.files?.profilePicture?.[0];
//     const profileImageUrl = profilePicFile
//       ? await uploadToCloudinary(profilePicFile.buffer, 'profile_images')
//       : null;

//     // ✅ Upload resume (optional)
//     const resumeFile = req.files?.resume?.[0];
//     const pdfUrl = resumeFile
//       ? await uploadToCloudinary(resumeFile.buffer, 'resumes')
//       : null;

//     // ✅ Upload education documents
//     const degreeFiles = await Promise.all(
//       (req.files?.degreeFiles || []).map(async (file) => {
//         const url = await uploadToCloudinary(file.buffer, 'education_files');
//         return {
//           degreeTitle: file.originalname,
//           degreeFile: url,
//         };
//       })
//     );

//     // ✅ Upload experience documents
//    const experienceFiles = await Promise.all(
//   (req.files?.experienceFiles || []).map(async (file, index) => {
//     const url = await uploadToCloudinary(file.buffer, 'experience_files');

//     return {
//       jobTitle: file.originalname,
//       fileUrl: url,
//       jobFunctions: Array.isArray(parsedJobFunctions?.[index])
//         ? parsedJobFunctions[index]
//         : [],
//     };
//   })
// );


//     // ✅ Create and Save Profile
//     const profile = new ProfileModel({
//       userId,
//       name,
//       fatherName,
//       gender,
//       dob,
//       cnic,
//       email,
//       mobile,
//       address,
//       city,
//       country,
//       profileImageUrl,
//       pdfUrl,
//       shiftPreferences: parsedShiftPreferences,
//       workAuthorization: parsedWorkAuthorization,
//       education: degreeFiles,
//       experience: experienceFiles,
//     });

//     await profile.save();

//     res.status(201).json({
//       success: true,
//       message: "Profile created successfully.",
//       data: profile,
//     });

//   } catch (error) {
//     console.error("🔥 Profile creation error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create profile.",
//       error: error.message,
//     });
//   }
// };

export const createProfile = async (req, res) => {
  try {
    // 1. Upload all files first
    const profilePicture = req.files?.profilePicture?.[0] 
      ? await uploadToCloudinary(req.files.profilePicture[0].buffer, 'profile_images') 
      : null;
    
    const resume = req.files?.resume?.[0] 
      ? await uploadToCloudinary(req.files.resume[0].buffer, 'resumes') 
      : null;

    // 2. Process education array
    const education = req.body.education?.map(async (edu, index) => {
      const degreeFile = req.files?.[`education[${index}][degreeFile]`]?.[0]
        ? await uploadToCloudinary(
            req.files[`education[${index}][degreeFile]`][0].buffer,
            'education_files'
          )
        : null;

      return {
        degreeTitle: edu.degreeTitle,
        institute: edu.institute,
        website: edu.website,
        startDate: new Date(edu.startDate),
        endDate: new Date(edu.endDate),
        degreeFile,
        degreeTitleVisibility: "Public",
        degreeTitleBadge: "Black",
        degreeTitleBadgeScore: 0,
        instituteVisibility: "Public",
        instituteBadge: "Black",
        instituteBadgeScore: 0,
        startDateVisibility: "Public",
        startDateBadge: "Black",
        startDateBadgeScore: 0,
        endDateVisibility: "Public",
        endDateBadge: "Black",
        endDateBadgeScore: 0,
        verificationLevel: "Silver",
        degreeFileVisibility: "Public",
        degreeFileBadge: "Black",
        degreeFileBadgeScore: 0,
        websiteVisibility: "Public",
        websiteBadge: "Black",
        websiteBadgeScore: 0
      };
    }) || [];

    // 3. Process experience array
    const experience = req.body.experience?.map(async (exp, index) => {
      const experienceFile = req.files?.[`experience[${index}][experienceFile]`]?.[0]
        ? await uploadToCloudinary(
            req.files[`experience[${index}][experienceFile]`][0].buffer,
            'experience_files'
          )
        : null;

      return {
        jobTitle: exp.jobTitle,
        company: exp.company,
        website: exp.website,
        startDate: new Date(exp.startDate),
        endDate: new Date(exp.endDate),
        jobFunctions: exp.jobFunctions || [],
        industry: exp.industry,
        experienceFile,
        jobTitleVisibility: "Public",
        jobTitleBadge: "Black",
        jobTitleBadgeScore: 0,
        companyVisibility: "Public",
        companyBadge: "Black",
        companyBadgeScore: 0,
        startDateVisibility: "Public",
        startDateBadge: "Black",
        startDateBadgeScore: 0,
        endDateVisibility: "Public",
        endDateBadge: "Black",
        endDateBadgeScore: 0,
        verificationLevel: "Silver",
        experienceFileVisibility: "Public",
        experienceFileBadge: "Black",
        experienceFileBadgeScore: 0,
        jobFunctionsVisibility: "Public",
        jobFunctionsBadge: "Black",
        jobFunctionsBadgeScore: 0,
        industryVisibility: "Public",
        industryBadge: "Black",
        industryBadgeScore: 0,
        websiteVisibility: "Public",
        websiteBadge: "Black",
        websiteBadgeScore: 0
      };
    }) || [];

    // Wait for all async operations to complete
    const [processedEducation, processedExperience] = await Promise.all([
      Promise.all(education),
      Promise.all(experience)
    ]);

    // 4. Prepare the complete profile data
    const profileData = {
      userId: req.body.userId,
      name: req.body.name,
      fatherName: req.body.fatherName,
      gender: req.body.gender,
      dob: new Date(req.body.dob),
      cnic: req.body.cnic,
      mobile: req.body.mobile,
      email: req.body.email,
      city: req.body.city,
      country: req.body.country,
      nationality: req.body.nationality,
      residentStatus: req.body.residentStatus,
      shiftPreferences: Array.isArray(req.body.shiftPreferences) 
        ? req.body.shiftPreferences 
        : [].concat(req.body.shiftPreferences),
      workAuthorization: Array.isArray(req.body.workAuthorization) 
        ? req.body.workAuthorization 
        : [].concat(req.body.workAuthorization),
      profilePicture,
      resume,
      education: processedEducation,
      experience: processedExperience,
      
      // Default visibility and badge settings for personal info
      nameVisibility: "Public",
      nameBadge: "Black",
      nameBadgeScore: 0,
      fatherNameVisibility: "Public",
      fatherNameBadge: "Black",
      fatherNameBadgeScore: 0,
      genderVisibility: "Public",
      genderBadge: "Black",
      genderBadgeScore: 0,
      dobVisibility: "Public",
      dobBadge: "Black",
      dobBadgeScore: 0,
      cnicVisibility: "Public",
      cnicBadge: "Black",
      cnicBadgeScore: 0,
      profilePictureVisibility: "Public",
      profilePictureBadge: "Black",
      profilePictureBadgeScore: 0,
      mobileVisibility: "Public",
      mobileBadge: "Black",
      mobileBadgeScore: 0,
      emailVisibility: "Public",
      emailBadge: "Black",
      emailBadgeScore: 0,
      addressVisibility: "Public",
      addressBadge: "Black",
      addressBadgeScore: 0,
      cityVisibility: "Public",
      cityBadge: "Black",
      cityBadgeScore: 0,
      countryVisibility: "Public",
      countryBadge: "Black",
      countryBadgeScore: 0,
      nationalityVisibility: "Public",
      nationalityBadge: "Black",
      nationalityBadgeScore: 0,
      residentStatusVisibility: "Public",
      residentStatusBadge: "Black",
      residentStatusBadgeScore: 0,
      shiftPreferencesVisibility: "Public",
      shiftPreferencesBadge: "Black",
      shiftPreferencesBadgeScore: 0,
      workAuthorizationVisibility: "Public",
      workAuthorizationBadge: "Black",
      workAuthorizationBadgeScore: 0,
      resumeVisibility: "Public",
      resumeBadge: "Black",
      resumeBadgeScore: 0
    };

    // 5. Validate required fields
    const requiredFields = [
      'userId', 'name', 'fatherName', 'gender', 'dob', 'cnic',
      'mobile', 'email', 'city', 'country', 'nationality',
      'profilePicture', 'resume'
    ];
    
    const missingFields = requiredFields.filter(field => !profileData[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // 6. Create and save profile
    const profile = new ProfileModel(profileData);
    await profile.save();

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: profile
    });

  } catch (error) {
    console.error("Profile creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create profile",
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
