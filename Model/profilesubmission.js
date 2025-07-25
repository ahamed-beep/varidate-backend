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
  nameVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  nameBadge: { type: String, enum: badgeEnum, default: "Black" },
  nameBadgeScore: { type: Number, default: 0 },

  fatherName: { type: String, required: true },
  fatherNameVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  fatherNameBadge: { type: String, enum: badgeEnum, default: "Black" },
  fatherNameBadgeScore: { type: Number, default: 0 },

  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  genderVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  genderBadge: { type: String, enum: badgeEnum, default: "Black" },
  genderBadgeScore: { type: Number, default: 0 },

  dob: { type: Date, required: true },
  dobVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  dobBadge: { type: String, enum: badgeEnum, default: "Black" },
  dobBadgeScore: { type: Number, default: 0 },

  cnic: { type: String, required: true },
  cnicVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  cnicBadge: { type: String, enum: badgeEnum, default: "Black" },
  cnicBadgeScore: { type: Number, default: 0 },

  profilePicture: { type: String },
  profilePictureVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  profilePictureBadge: { type: String, enum: badgeEnum, default: "Black" },
  profilePictureBadgeScore: { type: Number, default: 0 },

  // Contact Info
  mobile: { type: String },
  mobileVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  mobileBadge: { type: String, enum: badgeEnum, default: "Black" },
  mobileBadgeScore: { type: Number, default: 0 },

  email: { type: String, required: true },
  emailVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  emailBadge: { type: String, enum: badgeEnum, default: "Black" },
  emailBadgeScore: { type: Number, default: 0 },

  address: { type: String },
  addressVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  addressBadge: { type: String, enum: badgeEnum, default: "Black" },
  addressBadgeScore: { type: Number, default: 0 },

  city: { type: String },
  cityVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  cityBadge: { type: String, enum: badgeEnum, default: "Black" },
  cityBadgeScore: { type: Number, default: 0 },

  country: { type: String },
  countryVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  countryBadge: { type: String, enum: badgeEnum, default: "Black" },
  countryBadgeScore: { type: Number, default: 0 },

  // Nationality & Resident
  nationality: { type: String },
  nationalityVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  nationalityBadge: { type: String, enum: badgeEnum, default: "Black" },
  nationalityBadgeScore: { type: Number, default: 0 },

  residentStatus: {
    type: String,
    enum: ["Citizen", "Permanent Resident", "Work Visa", "Student Visa", "Other"],
  },
  residentStatusVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  residentStatusBadge: { type: String, enum: badgeEnum, default: "Black" },
  residentStatusBadgeScore: { type: Number, default: 0 },

  shiftPreferences: [{ type: String }],
  shiftPreferencesVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  shiftPreferencesBadge: { type: String, enum: badgeEnum, default: "Black" },
  shiftPreferencesBadgeScore: { type: Number, default: 0 },

  workAuthorization: [{ type: String }],
  workAuthorizationVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  workAuthorizationBadge: { type: String, enum: badgeEnum, default: "Black" },
  workAuthorizationBadgeScore: { type: Number, default: 0 },

  // Education
  education: [
    {
      degreeTitle: { type: String },
      degreeTitleVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      degreeTitleBadge: { type: String, enum: badgeEnum, default: "Black" },
      degreeTitleBadgeScore: { type: Number, default: 0 },

      institute: { type: String },
      instituteVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      instituteBadge: { type: String, enum: badgeEnum, default: "Black" },
      instituteBadgeScore: { type: Number, default: 0 },

      startDate: { type: Date },
      startDateVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      startDateBadge: { type: String, enum: badgeEnum, default: "Black" },
      startDateBadgeScore: { type: Number, default: 0 },

      endDate: { type: Date },
      endDateVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      endDateBadge: { type: String, enum: badgeEnum, default: "Black" },
      endDateBadgeScore: { type: Number, default: 0 },

      verificationLevel: {
        type: String,
        enum: ["None", "Verified", "Rejected", "Silver"],
        default: "Silver",
      },

      degreeFile: { type: String },
      degreeFileVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      degreeFileBadge: { type: String, enum: badgeEnum, default: "Black" },
      degreeFileBadgeScore: { type: Number, default: 0 },

      website: { type: String },
      websiteVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      websiteBadge: { type: String, enum: badgeEnum, default: "Black" },
      websiteBadgeScore: { type: Number, default: 0 },
    },
  ],

  // Experience
  experience: [
    {
      jobTitle: { type: String },
      jobTitleVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      jobTitleBadge: { type: String, enum: badgeEnum, default: "Black" },
      jobTitleBadgeScore: { type: Number, default: 0 },

      company: { type: String },
      companyVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      companyBadge: { type: String, enum: badgeEnum, default: "Black" },
      companyBadgeScore: { type: Number, default: 0 },

      startDate: { type: Date },
      startDateVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      startDateBadge: { type: String, enum: badgeEnum, default: "Black" },
      startDateBadgeScore: { type: Number, default: 0 },

      endDate: { type: Date },
      endDateVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      endDateBadge: { type: String, enum: badgeEnum, default: "Black" },
      endDateBadgeScore: { type: Number, default: 0 },

      verificationLevel: {
        type: String,
        enum: ["None", "Verified", "Rejected", "Silver"],
        default: "Silver",
      },

      fileUrl: { type: String },
      fileUrlVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      fileUrlBadge: { type: String, enum: badgeEnum, default: "Black" },
      fileUrlBadgeScore: { type: Number, default: 0 },

      jobFunctions: [{ type: String }],
      jobFunctionsVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      jobFunctionsBadge: { type: String, enum: badgeEnum, default: "Black" },
      jobFunctionsBadgeScore: { type: Number, default: 0 },

      industry: { type: String },
      industryVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      industryBadge: { type: String, enum: badgeEnum, default: "Black" },
      industryBadgeScore: { type: Number, default: 0 },

      website: { type: String },
      websiteVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      websiteBadge: { type: String, enum: badgeEnum, default: "Black" },
      websiteBadgeScore: { type: Number, default: 0 },
    },
  ],

  // Images & Documents
  profileImageUrl: { type: String },
  profileImageUrlVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  profileImageUrlBadge: { type: String, enum: badgeEnum, default: "Black" },
  profileImageUrlBadgeScore: { type: Number, default: 0 },

  pdfUrl: { type: String },
  pdfUrlVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  pdfUrlBadge: { type: String, enum: badgeEnum, default: "Black" },
  pdfUrlBadgeScore: { type: Number, default: 0 },

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


