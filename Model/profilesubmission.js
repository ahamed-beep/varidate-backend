import mongoose, { Schema } from "mongoose";

const badgeEnum = ["Black", "Silver", "Gold", "Platinum"];
const visibilityEnum = ["Public", "Private", "Hide"];

const ProfessionalProfileSchema = new Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    index: true,
  },
  // Personal Info
  name: { type: String, required: true },
  nameVisibility: { type: String, enum: visibilityEnum,  required: true ,default: "Public" },
  nameBadge: { type: String, enum: badgeEnum, default: "Black" },
  nameBadgeScore: { type: Number, default: 0 },
  nameVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for name field

  fatherName: { type: String, required: true },
  fatherNameVisibility: { type: String, enum: visibilityEnum,  required: true ,default: "Public"},
  fatherNameBadge: { type: String, enum: badgeEnum, default: "Black" },
  fatherNameBadgeScore: { type: Number, default: 0 },
  fatherNameVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for fatherName field

  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  genderVisibility: { type: String, enum: visibilityEnum,  required: true ,default: "Public" },
  genderBadge: { type: String, enum: badgeEnum, default: "Black" },
  genderBadgeScore: { type: Number, default: 0 },
  genderVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for gender field

  

  


  dob: { type: Date, required: true },
  dobVisibility: { type: String, enum: visibilityEnum, required: true ,default: "Public"},
  dobBadge: { type: String, enum: badgeEnum, default: "Black" },
  dobBadgeScore: { type: Number, default: 0 },
  dobVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for dob field

  cnic: { type: String, required: true },
  cnicVisibility: { type: String, enum: visibilityEnum,  },
  cnicBadge: { type: String, enum: badgeEnum, default: "Black" },
  cnicBadgeScore: { type: Number, default: 0 },
  cnicVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for cnic field

  profilePicture: { type: String, required: true },
  profilePictureVisibility: { type: String, enum: visibilityEnum,  required: true ,default: "Public"},
  profilePictureBadge: { type: String, enum: badgeEnum, default: "Black" },
  profilePictureBadgeScore: { type: Number, default: 0 },
  profilePictureVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for profilePicture field

  // Contact Info
  mobile: { type: String, required: true },
  mobileVisibility: { type: String, enum: visibilityEnum,  required: true ,default: "Public"},
  mobileBadge: { type: String, enum: badgeEnum, default: "Black" },
  mobileBadgeScore: { type: Number, default: 0 },
  mobileVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for mobile field

  email: { type: String, required: true },
  emailVisibility: { type: String, enum: visibilityEnum, required: true,default: "Public" },
  emailBadge: { type: String, enum: badgeEnum, default: "Black" },
  emailBadgeScore: { type: Number, default: 0 },
  emailVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for email field

  address: { type: String },
  addressVisibility: { type: String, enum: visibilityEnum,  required: false },
  addressBadge: { type: String, enum: badgeEnum, default: "Black" },
  addressBadgeScore: { type: Number, default: 0 },
  addressVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for address field

  city: { type: String, required: true },
  cityVisibility: { type: String, enum: visibilityEnum,  required: true,default: "Public" },
  cityBadge: { type: String, enum: badgeEnum, default: "Black" },
  cityBadgeScore: { type: Number, default: 0 },
  cityVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for city field

  country: { type: String, required: true },
  countryVisibility: { type: String, enum: visibilityEnum, required: true ,default: "Public"},
  countryBadge: { type: String, enum: badgeEnum, default: "Black" },
  countryBadgeScore: { type: Number, default: 0 },
  countryVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for country field

  // Nationality & Resident
  nationality: { type: String, required: true },
  nationalityVisibility: { type: String, enum: visibilityEnum, required: true ,default: "Public" },
  nationalityBadge: { type: String, enum: badgeEnum, default: "Black" },
  nationalityBadgeScore: { type: Number, default: 0 },
  nationalityVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for nationality field

  residentStatus: {
    type: String,
    enum: ["Citizen", "Permanent Resident", "Work Visa", "Student Visa", "Other"],
  },
  residentStatusVisibility: { type: String, enum: visibilityEnum, required: true ,default: "Public" },
  residentStatusBadge: { type: String, enum: badgeEnum, default: "Black" },
  residentStatusBadgeScore: { type: Number, default: 0 },
  residentStatusVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for residentStatus field

  maritalStatus: { type: String },
maritalStatusVisibility: { type: String, enum: visibilityEnum,  required: true, default: "Public"},
maritalStatusBadge: {  type: String, enum: badgeEnum, default: "Black",},
maritalStatusBadgeScore: { type: Number, default: 0,},
maritalStatusVotedBy: [  {type: mongoose.Schema.Types.ObjectId, ref: "User",},],

  shiftPreferences: [{ type: String, required: true }],
  shiftPreferencesVisibility: { type: String, enum: visibilityEnum,  required: true ,default: "Public"},
  shiftPreferencesBadge: { type: String, enum: badgeEnum, default: "Black" },
  shiftPreferencesBadgeScore: { type: Number, default: 0 },
  shiftPreferencesVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for shiftPreferences field

  workAuthorization: [{ type: String, required: true }],
  workAuthorizationVisibility: { type: String, enum: visibilityEnum ,default: "Public" },
  workAuthorizationBadge: { type: String, enum: badgeEnum, default: "Black", required: true },
  workAuthorizationBadgeScore: { type: Number, default: 0 },
  workAuthorizationVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for workAuthorization field

  // Education
  education: [
    {
      degreeTitle: { type: String, required: true },
      degreeTitleVisibility: { type: String, enum: visibilityEnum, required: true ,default: "Public" },
      degreeTitleBadge: { type: String, enum: badgeEnum, default: "Black" },
      degreeTitleBadgeScore: { type: Number, default: 0 },
      degreeTitleVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for education.degreeTitle

      institute: { type: String, required: true },
      instituteVisibility: { type: String, enum: visibilityEnum,  required: true  ,default: "Public"},
      instituteBadge: { type: String, enum: badgeEnum, default: "Black" },
      instituteBadgeScore: { type: Number, default: 0 },
      instituteVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for education.institute

      startDate: { type: Date, required: true },
      startDateVisibility: { type: String, enum: visibilityEnum,  required: true ,default: "Public" },
      startDateBadge: { type: String, enum: badgeEnum, default: "Black" },
      startDateBadgeScore: { type: Number, default: 0 },
      startDateVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for education.startDate

      endDate: { type: Date, required: true },
      endDateVisibility: { type: String, enum: visibilityEnum,  required: true  ,default: "Public"},
      endDateBadge: { type: String, enum: badgeEnum, default: "Black" },
      endDateBadgeScore: { type: Number, default: 0 },
      endDateVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for education.endDate

      verificationLevel: {
        type: String,
        enum: ["None", "Verified", "Rejected", "Silver"],
        default: "Silver",
      },

      degreeFile: { type: String, required: true },
      degreeFileVisibility: { type: String, enum: visibilityEnum,  required: true ,default: "Public"},
      degreeFileBadge: { type: String, enum: badgeEnum, default: "Black" },
      degreeFileBadgeScore: { type: Number, default: 0 },
      degreeFileVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for education.degreeFile

      website: { type: String, required: true },
      websiteVisibility: { type: String, enum: visibilityEnum,  required: true ,default: "Public" },
      websiteBadge: { type: String, enum: badgeEnum, default: "Black" },
      websiteBadgeScore: { type: Number, default: 0 },
      websiteVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for education.website
      // The updatedBy array for the entire education subdocument is already here:
      updatedBy: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
      }]
    },
  ],

  // Experience
  experience: [
    {
      jobTitle: { type: String, required: true },
      jobTitleVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
      jobTitleBadge: { type: String, enum: badgeEnum, default: "Black" },
      jobTitleBadgeScore: { type: Number, default: 0 },
      jobTitleVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for experience.jobTitle

      company: { type: String, required: true },
      companyVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
      companyBadge: { type: String, enum: badgeEnum, default: "Black" },
      companyBadgeScore: { type: Number, default: 0 },
      companyVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for experience.company

      startDate: { type: Date, required: true },
      startDateVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
      startDateBadge: { type: String, enum: badgeEnum, default: "Black" },
      startDateBadgeScore: { type: Number, default: 0 },
      startDateVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for experience.startDate

      endDate: { type: Date, required: true },
      endDateVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
      endDateBadge: { type: String, enum: badgeEnum, default: "Black" },
      endDateBadgeScore: { type: Number, default: 0 },
      endDateVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for experience.endDate

      verificationLevel: {
        type: String,
        enum: ["None", "Verified", "Rejected", "Silver"],
        default: "Silver",
      },

      experienceFile: { type: String, required: true },
      experienceFileVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
      experienceFileBadge: { type: String, enum: badgeEnum, default: "Black" },
      experienceFileBadgeScore: { type: Number, default: 0 }, // Added missing score for consistency
      experienceFileVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for experience.experienceFile


      jobFunctions: [{ type: String, required: true }],
      jobFunctionsVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
      jobFunctionsBadge: { type: String, enum: badgeEnum, default: "Black" },
      jobFunctionsBadgeScore: { type: Number, default: 0 },
      jobFunctionsVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for experience.jobFunctions

      industry: { type: String, required: true },
      industryVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
      industryBadge: { type: String, enum: badgeEnum, default: "Black" },
      industryBadgeScore: { type: Number, default: 0 },
      industryVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for experience.industry

      website: { type: String, required: true },
      websiteVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
      websiteBadge: { type: String, enum: badgeEnum, default: "Black" },
      websiteBadgeScore: { type: Number, default: 0 },
      websiteVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for experience.website

      // The updatedBy array for the entire experience subdocument is already here:
      updatedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }]
    },
  ],

  // Images & Documents (assuming these might also have badge scores in future, currently only have badge)
  // If profilePicture and resume will also have scores, you'd add votedBy here too.
  profilePicture: { type: String, required: true },
  profilePictureVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
  profilePictureBadge: { type: String, enum: badgeEnum, default: "Black" },
  // profilePictureBadgeScore is already defined above under Personal Info, so no need for duplication here.

  resume: { type: String, required: true },
  resumeVisibility: { type: String, enum: visibilityEnum, default: "Public", required: true },
  resumeBadge: { type: String, enum: badgeEnum, default: "Black" },
  resumeBadgeScore: { type: Number, default: 0 }, // Added missing score for consistency
  resumeVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added for resume field

  createdAt: { type: Date, default: Date.now },
});

ProfessionalProfileSchema.set('debug', true);

// Add better validation messages
ProfessionalProfileSchema.path('nameBadgeScore').validate(function (value) {
  return typeof value === 'number' && value >= 0 && value <= 20;
}, 'Badge score must be between 0-20');
ProfessionalProfileSchema.index({ cnic: 1 });
// Add index for userId for efficient lookups
ProfessionalProfileSchema.index({ userId: 1 });
// Add indexes for subdocument _ids for efficient subdocument lookups
ProfessionalProfileSchema.index({ 'education._id': 1 });
ProfessionalProfileSchema.index({ 'experience._id': 1 });


const ProfileModel = mongoose.model("ProfileSubmission", ProfessionalProfileSchema);
export default ProfileModel;