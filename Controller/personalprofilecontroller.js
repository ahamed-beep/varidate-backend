import uploadToCloudinary from "../Middleware/Cloudinaryuploader.js";
import ProfileModel from "../Model/profilesubmission.js";

export const createProfile = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['name', 'email', 'cnic', 'fatherName'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // File validation
    if (!req.files?.resume?.[0] || !req.files?.cnicFile?.[0]) {
      return res.status(400).json({
        success: false,
        message: 'Both resume and CNIC files are required'
      });
    }

    // Process main files
    const [resumeUrl, cnicUrl] = await Promise.all([
      uploadToCloudinary(req.files.resume[0].buffer, "resumes"),
      uploadToCloudinary(req.files.cnicFile[0].buffer, "cnic_files")
    ]);

    // Process education files with error handling
    const education = await Promise.all(
      req.body.education?.map(async (edu, index) => {
        try {
          const file = req.files.educationFiles?.[index];
          const fileUrl = file ? await uploadToCloudinary(file.buffer, "education_files") : null;
          
          return {
            degreeTitle: edu.degreeTitle,
            institute: edu.institute,
            startDate: edu.startDate,
            endDate: edu.endDate,
            website: edu.website,
            fileUrl
          };
        } catch (error) {
          console.error(`Error processing education file ${index}:`, error);
          return {
            ...edu,
            fileUrl: null,
            uploadError: 'Failed to upload document'
          };
        }
      }) || []
    );

    // Process experience files with error handling
    const experience = await Promise.all(
      req.body.experience?.map(async (exp, index) => {
        try {
          const file = req.files.experienceFiles?.[index];
          const fileUrl = file ? await uploadToCloudinary(file.buffer, "experience_files") : null;
          
          return {
            jobTitle: exp.jobTitle,
            company: exp.company,
            startDate: exp.startDate,
            endDate: exp.endDate,
            website: exp.website,
            jobFunctions: exp.jobFunctions,
            industry: exp.industry,
            fileUrl
          };
        } catch (error) {
          console.error(`Error processing experience file ${index}:`, error);
          return {
            ...exp,
            fileUrl: null,
            uploadError: 'Failed to upload document'
          };
        }
      }) || []
    );

    // Create and save profile
    const newProfile = new ProfileModel({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      cnic: req.body.cnic,
      fatherName: req.body.fatherName,
      gender: req.body.gender,
      dob: req.body.dob,
      city: req.body.city,
      country: req.body.country,
      maritalStatus: req.body.maritalStatus,
      residentStatus: req.body.residentStatus,
      nationality: req.body.nationality,
      shiftPreferences: req.body.shiftPreferences,
      workAuthorization: req.body.workAuthorization,
      resumeUrl,
      cnicUrl,
      education,
      experience
    });

    await newProfile.save();

    return res.status(201).json({
      success: true,
      data: newProfile,
      message: 'Profile created successfully'
    });

  } catch (error) {
    console.error("Error creating profile:", error);
    
    // More specific error handling
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: error.errors
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};