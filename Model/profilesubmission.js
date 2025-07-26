import mongoose, { Schema } from "mongoose";

const badgeEnum = ["Black", "Silver", "Gold", "Platinum"];
const visibilityEnum = ["Public", "Private", "Hide"];

const ProfessionalProfileSchema = new Schema({

 userId: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  unique: true,
  index: true, // ← First index definition here
},
  // Personal Info
  name: { type: String, required: true },
  nameVisibility: { type: String, enum: visibilityEnum, default: "Public" , },
  nameBadge: { type: String, enum: badgeEnum, default: "Black" },
  nameBadgeScore: { type: Number, default: 0 },

  fatherName: { type: String, required: true },
  fatherNameVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
  fatherNameBadge: { type: String, enum: badgeEnum, default: "Black" },
  fatherNameBadgeScore: { type: Number, default: 0 },

  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  genderVisibility: { type: String, enum: visibilityEnum, default: "Public" },
  genderBadge: { type: String, enum: badgeEnum, default: "Black" },
  genderBadgeScore: { type: Number, default: 0 },

  dob: { type: Date, required: true },
  dobVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
  dobBadge: { type: String, enum: badgeEnum, default: "Black" },
  dobBadgeScore: { type: Number, default: 0 },

  cnic: { type: String, required: true },
  cnicVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
  cnicBadge: { type: String, enum: badgeEnum, default: "Black" },
  cnicBadgeScore: { type: Number, default: 0 },

  profilePicture: { type: String ,required:true},
  profilePictureVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
  profilePictureBadge: { type: String, enum: badgeEnum, default: "Black" },
  profilePictureBadgeScore: { type: Number, default: 0 },

  // Contact Info
  mobile: { type: String , required:true },
  mobileVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
  mobileBadge: { type: String, enum: badgeEnum, default: "Black" },
  mobileBadgeScore: { type: Number, default: 0 },

  email: { type: String, required: true },
  emailVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
  emailBadge: { type: String, enum: badgeEnum, default: "Black" },
  emailBadgeScore: { type: Number, default: 0 },

  address: { type: String },
  addressVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
  addressBadge: { type: String, enum: badgeEnum, default: "Black" },
  addressBadgeScore: { type: Number, default: 0 },

  city: { type: String ,required:true},
  cityVisibility: { type: String, enum: visibilityEnum, default: "Public" },
  cityBadge: { type: String, enum: badgeEnum, default: "Black" },
  cityBadgeScore: { type: Number, default: 0 },

  country: { type: String ,required:true},
  countryVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
  countryBadge: { type: String, enum: badgeEnum, default: "Black" },
  countryBadgeScore: { type: Number, default: 0 },

  // Nationality & Resident
  nationality: { type: String,required:true },
  nationalityVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
  nationalityBadge: { type: String, enum: badgeEnum, default: "Black" },
  nationalityBadgeScore: { type: Number, default: 0 },

  residentStatus: {
    type: String,
    enum: ["Citizen", "Permanent Resident", "Work Visa", "Student Visa", "Other"],
  },
  residentStatusVisibility: { type: String, enum: visibilityEnum, default:"Public" ,required:true  },
  residentStatusBadge: { type: String, enum: badgeEnum, default: "Black" },
  residentStatusBadgeScore: { type: Number, default: 0 },

  shiftPreferences: [{ type: String ,required:true}],
  shiftPreferencesVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
  shiftPreferencesBadge: { type: String, enum: badgeEnum, default: "Black" },
  shiftPreferencesBadgeScore: { type: Number, default: 0 },

  workAuthorization: [{ type: String ,required:true}],
  workAuthorizationVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
  workAuthorizationBadge: { type: String, enum: badgeEnum, default: "Black" },
  workAuthorizationBadgeScore: { type: Number, default: 0 },

  // Education
  education: [
    {
      degreeTitle: { type: String ,required:true},
      degreeTitleVisibility: { type: String, enum: visibilityEnum, default: "Public" },
      degreeTitleBadge: { type: String, enum: badgeEnum, default: "Black" },
      degreeTitleBadgeScore: { type: Number, default: 0 },

      institute: { type: String,required:true },
      instituteVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
      instituteBadge: { type: String, enum: badgeEnum, default: "Black" },
      instituteBadgeScore: { type: Number, default: 0 },

      startDate: { type: Date,required:true },
      startDateVisibility: { type: String, enum: visibilityEnum, default: "Public" },
      startDateBadge: { type: String, enum: badgeEnum, default: "Black" },
      startDateBadgeScore: { type: Number, default: 0 },

      endDate: { type: Date,required:true },
      endDateVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
      endDateBadge: { type: String, enum: badgeEnum, default: "Black" },
      endDateBadgeScore: { type: Number, default: 0 },

      verificationLevel: {
        type: String,
        enum: ["None", "Verified", "Rejected", "Silver"],
        default: "Silver",
      },

      degreeFile: { type: String ,required:true},
      degreeFileVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
      degreeFileBadge: { type: String, enum: badgeEnum, default: "Black" },
      degreeFileBadgeScore: { type: Number, default: 0 },

      website: { type: String ,required:true },
      websiteVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
      websiteBadge: { type: String, enum: badgeEnum, default: "Black" },
      websiteBadgeScore: { type: Number, default: 0 },
    },
  ],

  // Experience
  experience: [
    {
      jobTitle: { type: String ,required:true },
      jobTitleVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
      jobTitleBadge: { type: String, enum: badgeEnum, default: "Black" },
      jobTitleBadgeScore: { type: Number, default: 0 },

      company: { type: String ,required:true },
      companyVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
      companyBadge: { type: String, enum: badgeEnum, default: "Black" },
      companyBadgeScore: { type: Number, default: 0 },

      startDate: { type: Date  , required:true},
      startDateVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
      startDateBadge: { type: String, enum: badgeEnum, default: "Black" },
      startDateBadgeScore: { type: Number, default: 0 },

      endDate: { type: Date,required:true },
      endDateVisibility: { type: String, enum: visibilityEnum, default: "Public" },
      endDateBadge: { type: String, enum: badgeEnum, default: "Black" },
      endDateBadgeScore: { type: Number, default: 0 },

      verificationLevel: {
        type: String,
        enum: ["None", "Verified", "Rejected", "Silver"],
        default: "Silver",
      },

     experienceFile: { type: String, required: true }, // Earlier: fileUrl
    experienceFileVisibility: { type: String, enum: visibilityEnum, default: "Public" },
    experienceFileBadge: { type: String, enum: badgeEnum, default: "Black" },

      jobFunctions: [{ type: String , required:true }],
      jobFunctionsVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
      jobFunctionsBadge: { type: String, enum: badgeEnum, default: "Black" },
      jobFunctionsBadgeScore: { type: Number, default: 0 },

      industry: { type: String , required:true },
      industryVisibility: { type: String, enum: visibilityEnum, default: "Public" },
      industryBadge: { type: String, enum: badgeEnum, default: "Black" },
      industryBadgeScore: { type: Number, default: 0 },

      website: { type: String , required:true },
      websiteVisibility: { type: String, enum: visibilityEnum, default: "Public" },
      websiteBadge: { type: String, enum: badgeEnum, default: "Black" },
      websiteBadgeScore: { type: Number, default: 0 },
    },
  ],

  // Images & Documents
 profilePicture: { type: String, required: true },  // Earlier: profileImageUrl
  profilePictureVisibility: { type: String, enum: visibilityEnum, default: "Public" },
  profilePictureBadge: { type: String, enum: badgeEnum, default: "Black" },

    resume: { type: String, required: true },  // Earlier: pdfUrl
  resumeVisibility: { type: String, enum: visibilityEnum, default: "Public" },
  resumeBadge: { type: String, enum: badgeEnum, default: "Black" },

  createdAt: { type: Date, default: Date.now },
});

ProfessionalProfileSchema.set('debug', true);

// Add better validation messages
ProfessionalProfileSchema.path('nameBadgeScore').validate(function(value) {
  return typeof value === 'number' && value >= 0 && value <= 20;
}, 'Badge score must be between 0-20');
ProfessionalProfileSchema.index({ cnic: 1 });
// Add to your schema
ProfessionalProfileSchema.index({ userId: 1 });
ProfessionalProfileSchema.index({ 'education._id': 1 });
ProfessionalProfileSchema.index({ 'experience._id': 1 });

const ProfileModel = mongoose.model("ProfileSubmission", ProfessionalProfileSchema);
export default ProfileModel;


