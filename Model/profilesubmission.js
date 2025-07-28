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
  nameVisibility: { type: String, enum: visibilityEnum, default: "Public" , required:true },
  nameBadge: { type: String, enum: badgeEnum, default: "Black" },
  nameBadgeScore: { type: Number, default: 0 },

  fatherName: { type: String, required: true },
  fatherNameVisibility: { type: String, enum: visibilityEnum, default: "Public",  required:true  },
  fatherNameBadge: { type: String, enum: badgeEnum, default: "Black" },
  fatherNameBadgeScore: { type: Number, default: 0 },

  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  genderVisibility: { type: String, enum: visibilityEnum, default: "Public", required:true },
  genderBadge: { type: String, enum: badgeEnum, default: "Black" },
  genderBadgeScore: { type: Number, default: 0 },

  dob: { type: Date, required: true },
  dobVisibility: { type: String, enum: visibilityEnum, default: "Public" , required:true },
  dobBadge: { type: String, enum: badgeEnum, default: "Black" },
  dobBadgeScore: { type: Number, default: 0 },

  cnic: { type: String, required: true },
  cnicVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
  cnicBadge: { type: String, enum: badgeEnum, default: "Black" },
  cnicBadgeScore: { type: Number, default: 0 },

  profilePicture: { type: String ,required:true},
  profilePictureVisibility: { type: String, enum: visibilityEnum, default: "Public" , required:true },
  profilePictureBadge: { type: String, enum: badgeEnum, default: "Black" },
  profilePictureBadgeScore: { type: Number, default: 0 },

  // Contact Info
  mobile: { type: String , required:true },
  mobileVisibility: { type: String, enum: visibilityEnum, default: "Public" , required:true },
  mobileBadge: { type: String, enum: badgeEnum, default: "Black" },
  mobileBadgeScore: { type: Number, default: 0 },

  email: { type: String, required: true },
  emailVisibility: { type: String, enum: visibilityEnum, default: "Public" , required:true },
  emailBadge: { type: String, enum: badgeEnum, default: "Black" },
  emailBadgeScore: { type: Number, default: 0 },

  address: { type: String },
  addressVisibility: { type: String, enum: visibilityEnum, default: "Public" , required:true },
  addressBadge: { type: String, enum: badgeEnum, default: "Black" },
  addressBadgeScore: { type: Number, default: 0 },

  city: { type: String ,required:true},
  cityVisibility: { type: String, enum: visibilityEnum, default: "Public", required:true },
  cityBadge: { type: String, enum: badgeEnum, default: "Black" },
  cityBadgeScore: { type: Number, default: 0 },

  country: { type: String ,required:true},
  countryVisibility: { type: String, enum: visibilityEnum, default: "Public" , required:true },
  countryBadge: { type: String, enum: badgeEnum, default: "Black" },
  countryBadgeScore: { type: Number, default: 0 },

  // Nationality & Resident
  nationality: { type: String,required:true },
  nationalityVisibility: { type: String, enum: visibilityEnum, default: "Public", required:true  },
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
  shiftPreferencesVisibility: { type: String, enum: visibilityEnum, default: "Public" , required:true },
  shiftPreferencesBadge: { type: String, enum: badgeEnum, default: "Black" },
  shiftPreferencesBadgeScore: { type: Number, default: 0 },

  workAuthorization: [{ type: String ,required:true}],
  workAuthorizationVisibility: { type: String, enum: visibilityEnum, default: "Public"  },
  workAuthorizationBadge: { type: String, enum: badgeEnum, default: "Black", required:true },
  workAuthorizationBadgeScore: { type: Number, default: 0 },

  // Education
  education: [
    {
      degreeTitle: { type: String ,required:true},
      degreeTitleVisibility: { type: String, enum: visibilityEnum, default: "Public" , required:true},
      degreeTitleBadge: { type: String, enum: badgeEnum, default: "Black" },
      degreeTitleBadgeScore: { type: Number, default: 0 },

      institute: { type: String,required:true },
      instituteVisibility: { type: String, enum: visibilityEnum, default: "Public" , required:true },
      instituteBadge: { type: String, enum: badgeEnum, default: "Black" },
      instituteBadgeScore: { type: Number, default: 0 },

      startDate: { type: Date,required:true },
      startDateVisibility: { type: String, enum: visibilityEnum, default: "Public" , required:true},
      startDateBadge: { type: String, enum: badgeEnum, default: "Black" },
      startDateBadgeScore: { type: Number, default: 0 },

      endDate: { type: Date,required:true },
      endDateVisibility: { type: String, enum: visibilityEnum, default: "Public" , required:true },
      endDateBadge: { type: String, enum: badgeEnum, default: "Black" },
      endDateBadgeScore: { type: Number, default: 0 },

      verificationLevel: {
        type: String,
        enum: ["None", "Verified", "Rejected", "Silver"],
        default: "Silver",
      },

      degreeFile: { type: String ,required:true},
      degreeFileVisibility: { type: String, enum: visibilityEnum, default: "Public" , required:true },
      degreeFileBadge: { type: String, enum: badgeEnum, default: "Black" },
      degreeFileBadgeScore: { type: Number, default: 0 },

      website: { type: String ,required:true },
      websiteVisibility: { type: String, enum: visibilityEnum, default: "Public", required:true  },
      websiteBadge: { type: String, enum: badgeEnum, default: "Black" },
      websiteBadgeScore: { type: Number, default: 0 },
    },
  ],

  // Experience
  experience: [
    {
      jobTitle: { type: String ,required:true },
      jobTitleVisibility: { type: String, enum: visibilityEnum, default: "Public" , required:true },
      jobTitleBadge: { type: String, enum: badgeEnum, default: "Black" },
      jobTitleBadgeScore: { type: Number, default: 0 },

      company: { type: String ,required:true },
      companyVisibility: { type: String, enum: visibilityEnum, default: "Public" , required:true },
      companyBadge: { type: String, enum: badgeEnum, default: "Black" },
      companyBadgeScore: { type: Number, default: 0 },

      startDate: { type: Date  , required:true},
      startDateVisibility: { type: String, enum: visibilityEnum, default: "Public" , required:true },
      startDateBadge: { type: String, enum: badgeEnum, default: "Black" },
      startDateBadgeScore: { type: Number, default: 0 },

      endDate: { type: Date,required:true },
      endDateVisibility: { type: String, enum: visibilityEnum, default: "Public", required:true },
      endDateBadge: { type: String, enum: badgeEnum, default: "Black" },
      endDateBadgeScore: { type: Number, default: 0 },

      verificationLevel: {
        type: String,
        enum: ["None", "Verified", "Rejected", "Silver"],
        default: "Silver",
      },

     experienceFile: { type: String, required: true }, // Earlier: fileUrl
    experienceFileVisibility: { type: String, enum: visibilityEnum, default: "Public" , required:true },
    experienceFileBadge: { type: String, enum: badgeEnum, default: "Black" },

      jobFunctions: [{ type: String , required:true }],
      jobFunctionsVisibility: { type: String, enum: visibilityEnum, default: "Public", required:true  },
      jobFunctionsBadge: { type: String, enum: badgeEnum, default: "Black" },
      jobFunctionsBadgeScore: { type: Number, default: 0 },

      industry: { type: String , required:true },
      industryVisibility: { type: String, enum: visibilityEnum, default: "Public", required:true },
      industryBadge: { type: String, enum: badgeEnum, default: "Black" },
      industryBadgeScore: { type: Number, default: 0 },

      website: { type: String , required:true },
      websiteVisibility: { type: String, enum: visibilityEnum, default: "Public", required:true },
      websiteBadge: { type: String, enum: badgeEnum, default: "Black" },
      websiteBadgeScore: { type: Number, default: 0 },
    },
  ],

  // Images & Documents
 profilePicture: { type: String, required: true },  // Earlier: profileImageUrl
  profilePictureVisibility: { type: String, enum: visibilityEnum, default: "Public", required:true },
  profilePictureBadge: { type: String, enum: badgeEnum, default: "Black" },

    resume: { type: String, required: true },  // Earlier: pdfUrl
  resumeVisibility: { type: String, enum: visibilityEnum, default: "Public", required:true },
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


// import mongoose, { Schema } from "mongoose";

// const badgeEnum = ["Black", "Silver", "Gold", "Platinum"];
// const visibilityEnum = ["Public", "Private", "Hide"];

// // Validator sub-schema
// const validatorSchema = new Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'User'
//   },
//   vote: {
//     type: String,
//     enum: ["yes", "no"],
//     required: true
//   },
//   validatedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, { _id: false });

// // Base configuration for badge score fields
// const badgeScoreField = {
//   type: Number,
//   default: 0,
//   validators: [validatorSchema]
// };

// const ProfessionalProfileSchema = new Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     unique: true,
//     index: true
//   },

//   // Personal Info
//   name: { type: String, required: true },
//   nameVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//   nameBadge: { type: String, enum: badgeEnum, default: "Black" },
//   nameBadgeScore: badgeScoreField,

//   fatherName: { type: String, required: true },
//   fatherNameVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//   fatherNameBadge: { type: String, enum: badgeEnum, default: "Black" },
//   fatherNameBadgeScore: badgeScoreField,

//   gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
//   genderVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//   genderBadge: { type: String, enum: badgeEnum, default: "Black" },
//   genderBadgeScore: badgeScoreField,

//   dob: { type: Date, required: true },
//   dobVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//   dobBadge: { type: String, enum: badgeEnum, default: "Black" },
//   dobBadgeScore: badgeScoreField,

//   cnic: { type: String, required: true },
//   cnicVisibility: { type: String, enum: visibilityEnum, default: "Public" },
//   cnicBadge: { type: String, enum: badgeEnum, default: "Black" },
//   cnicBadgeScore: badgeScoreField,

//   profilePicture: { type: String, required: true },
//   profilePictureVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//   profilePictureBadge: { type: String, enum: badgeEnum, default: "Black" },
//   profilePictureBadgeScore: badgeScoreField,

//   // Contact Info
//   mobile: { type: String, required: true },
//   mobileVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//   mobileBadge: { type: String, enum: badgeEnum, default: "Black" },
//   mobileBadgeScore: badgeScoreField,

//   email: { type: String, required: true },
//   emailVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//   emailBadge: { type: String, enum: badgeEnum, default: "Black" },
//   emailBadgeScore: badgeScoreField,

//   address: { type: String },
//   addressVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//   addressBadge: { type: String, enum: badgeEnum, default: "Black" },
//   addressBadgeScore: badgeScoreField,

//   city: { type: String, required: true },
//   cityVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//   cityBadge: { type: String, enum: badgeEnum, default: "Black" },
//   cityBadgeScore: badgeScoreField,

//   country: { type: String, required: true },
//   countryVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//   countryBadge: { type: String, enum: badgeEnum, default: "Black" },
//   countryBadgeScore: badgeScoreField,

//   // Nationality & Resident
//   nationality: { type: String, required: true },
//   nationalityVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//   nationalityBadge: { type: String, enum: badgeEnum, default: "Black" },
//   nationalityBadgeScore: badgeScoreField,

//   residentStatus: {
//     type: String,
//     enum: ["Citizen", "Permanent Resident", "Work Visa", "Student Visa", "Other"],
//   },
//   residentStatusVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//   residentStatusBadge: { type: String, enum: badgeEnum, default: "Black" },
//   residentStatusBadgeScore: badgeScoreField,

//   shiftPreferences: [{ type: String, required: true }],
//   shiftPreferencesVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//   shiftPreferencesBadge: { type: String, enum: badgeEnum, default: "Black" },
//   shiftPreferencesBadgeScore: badgeScoreField,

//   workAuthorization: [{ type: String, required: true }],
//   workAuthorizationVisibility: { type: String, enum: visibilityEnum, default: "Public" },
//   workAuthorizationBadge: { type: String, enum: badgeEnum, default: "Black", required: true },
//   workAuthorizationBadgeScore: badgeScoreField,

//   // Education
//   education: [
//     {
//       degreeTitle: { type: String, required: true },
//       degreeTitleVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//       degreeTitleBadge: { type: String, enum: badgeEnum, default: "Black" },
//       degreeTitleBadgeScore: badgeScoreField,

//       institute: { type: String, required: true },
//       instituteVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//       instituteBadge: { type: String, enum: badgeEnum, default: "Black" },
//       instituteBadgeScore: badgeScoreField,

//       startDate: { type: Date, required: true },
//       startDateVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//       startDateBadge: { type: String, enum: badgeEnum, default: "Black" },
//       startDateBadgeScore: badgeScoreField,

//       endDate: { type: Date, required: true },
//       endDateVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//       endDateBadge: { type: String, enum: badgeEnum, default: "Black" },
//       endDateBadgeScore: badgeScoreField,

//       verificationLevel: {
//         type: String,
//         enum: ["None", "Verified", "Rejected", "Silver"],
//         default: "Silver",
//       },

//       degreeFile: { type: String, required: true },
//       degreeFileVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//       degreeFileBadge: { type: String, enum: badgeEnum, default: "Black" },
//       degreeFileBadgeScore: badgeScoreField,

//       website: { type: String, required: true },
//       websiteVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//       websiteBadge: { type: String, enum: badgeEnum, default: "Black" },
//       websiteBadgeScore: badgeScoreField,
//     },
//   ],

//   // Experience
//   experience: [
//     {
//       jobTitle: { type: String, required: true },
//       jobTitleVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//       jobTitleBadge: { type: String, enum: badgeEnum, default: "Black" },
//       jobTitleBadgeScore: badgeScoreField,

//       company: { type: String, required: true },
//       companyVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//       companyBadge: { type: String, enum: badgeEnum, default: "Black" },
//       companyBadgeScore: badgeScoreField,

//       startDate: { type: Date, required: true },
//       startDateVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//       startDateBadge: { type: String, enum: badgeEnum, default: "Black" },
//       startDateBadgeScore: badgeScoreField,

//       endDate: { type: Date, required: true },
//       endDateVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//       endDateBadge: { type: String, enum: badgeEnum, default: "Black" },
//       endDateBadgeScore: badgeScoreField,

//       verificationLevel: {
//         type: String,
//         enum: ["None", "Verified", "Rejected", "Silver"],
//         default: "Silver",
//       },

//       experienceFile: { type: String, required: true },
//       experienceFileVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//       experienceFileBadge: { type: String, enum: badgeEnum, default: "Black" },
//       experienceFileBadgeScore: badgeScoreField,

//       jobFunctions: [{ type: String, required: true }],
//       jobFunctionsVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//       jobFunctionsBadge: { type: String, enum: badgeEnum, default: "Black" },
//       jobFunctionsBadgeScore: badgeScoreField,

//       industry: { type: String, required: true },
//       industryVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//       industryBadge: { type: String, enum: badgeEnum, default: "Black" },
//       industryBadgeScore: badgeScoreField,

//       website: { type: String, required: true },
//       websiteVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//       websiteBadge: { type: String, enum: badgeEnum, default: "Black" },
//       websiteBadgeScore: badgeScoreField,
//     },
//   ],

//   // Images & Documents
//   profilePicture: { type: String, required: true },
//   profilePictureVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//   profilePictureBadge: { type: String, enum: badgeEnum, default: "Black" },
//   profilePictureBadgeScore: badgeScoreField,

//   resume: { type: String, required: true },
//   resumeVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
//   resumeBadge: { type: String, enum: badgeEnum, default: "Black" },
//   resumeBadgeScore: badgeScoreField,

//   createdAt: { type: Date, default: Date.now },
// });

// // Validation and indexes
// ProfessionalProfileSchema.path('nameBadgeScore').validate(function(value) {
//   return typeof value === 'number' && value >= 0 && value <= 20;
// }, 'Badge score must be between 0-20');

// ProfessionalProfileSchema.index({ cnic: 1 });
// ProfessionalProfileSchema.index({ userId: 1 });
// ProfessionalProfileSchema.index({ 'education._id': 1 });
// ProfessionalProfileSchema.index({ 'experience._id': 1 });

// // Add compound index for validator tracking
// ProfessionalProfileSchema.index({ 
//   'education.validators.userId': 1,
//   'education.validators.vote': 1 
// });

// ProfessionalProfileSchema.index({ 
//   'experience.validators.userId': 1,
//   'experience.validators.vote': 1 
// });

// const ProfileModel = mongoose.model("ProfileSubmission", ProfessionalProfileSchema);
// export default ProfileModel;


