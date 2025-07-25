import uploadToCloudinary from "../Middleware/Cloudinaryuploader.js";
import ProfileModel from "../Model/profilesubmission.js";
import _ from "lodash";


export const createProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      cnic,
      fatherName,
      dob,
      gender,
      mobile,
      address,
      city,
      country,
      userId,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required.' });
    }

    // ✅ Upload profile image (optional)
    const profilePicFile = req.files?.profilePicture?.[0];
    const profileImageUrl = profilePicFile
      ? await uploadToCloudinary(profilePicFile.buffer, 'profile_images')
      : null;

    // ✅ Upload resume (optional)
    const resumeFile = req.files?.resume?.[0];
    const pdfUrl = resumeFile
      ? await uploadToCloudinary(resumeFile.buffer, 'resumes')
      : null;

    // ✅ Upload education documents
    const degreeFiles = await Promise.all(
      (req.files?.degreeFiles || []).map(async (file) => {
        const url = await uploadToCloudinary(file.buffer, 'education_files');
        return {
          degreeTitle: file.originalname,
          degreeFile: url,
        };
      })
    );

    // ✅ Upload experience documents
    const experienceFiles = await Promise.all(
      (req.files?.experienceFiles || []).map(async (file) => {
        const url = await uploadToCloudinary(file.buffer, 'experience_files');
        return {
          jobTitle: file.originalname,
          fileUrl: url,
        };
      })
    );

    // ✅ Create profile object
    const profile = new ProfileModel({
      userId,
      name,
      fatherName,
      gender,
      dob,
      cnic,
      email,
      mobile,
      address,
      city,
      country,
      profileImageUrl,
      pdfUrl,
      education: degreeFiles,
      experience: experienceFiles,
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Profile created successfully.',
      data: profile,
    });

  } catch (error) {
    console.error('🔥 Profile creation error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create profile.',
      error: error.message,
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







const getBadgeFromScore = (score) => {
  if (score >= 15) return "Platinum";
  if (score >= 10) return "Gold";
  if (score >= 5) return "Silver";
  return "Black";
};

export const updateAllBadgeScores = async (req, res) => {
  try {
    const profileId = req.params.id;
    const { votes } = req.body;

    if (!profileId || !votes || typeof votes !== "object") {
      return res.status(400).json({
        success: false,
        error: "Missing required fields or invalid format"
      });
    }

    const profile = await ProfileModel.findById(profileId);
    if (!profile) {
      return res.status(404).json({ success: false, error: "Profile not found" });
    }

    const validationErrors = [];

    for (const [key, value] of Object.entries(votes)) {
      const voteScore = value === "yes" ? 1 : 0;

      // Handle top-level fields (e.g., nameBadgeScore)
      if (!key.includes("-")) {
        const prevScore = profile[key] || 0;
        const newScore = prevScore + voteScore;
        profile[key] = newScore;
        profile[key.replace("BadgeScore", "Badge")] = getBadgeFromScore(newScore);
        continue;
      }

      // Handle nested fields: edu-degreeTitle-0 or exp-institute-1
      const parts = key.split("-");
      if (parts.length !== 3) continue;

      const [section, field, indexStr] = parts;
      const index = parseInt(indexStr);

      if (isNaN(index)) {
        validationErrors.push(`Invalid index for key: ${key}`);
        continue;
      }

      if (section === "edu" && profile.education[index]) {
        const prevScore = profile.education[index][`${field}BadgeScore`] || 0;
        const newScore = prevScore + voteScore;
        profile.education[index][`${field}BadgeScore`] = newScore;
        profile.education[index][`${field}Badge`] = getBadgeFromScore(newScore);
      } else if (section === "exp" && profile.experience[index]) {
        const prevScore = profile.experience[index][`${field}BadgeScore`] || 0;
        const newScore = prevScore + voteScore;
        profile.experience[index][`${field}BadgeScore`] = newScore;
        profile.experience[index][`${field}Badge`] = getBadgeFromScore(newScore);
      } else {
        validationErrors.push(`Invalid section or index: ${key}`);
      }
    }

    profile.markModified("education");
    profile.markModified("experience");

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "All badge scores updated successfully",
      validationErrors,
      updated: profile
    });

  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: err.message
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
