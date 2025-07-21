import mongoose from "mongoose";

const { Schema } = mongoose;

const ProfessionalProfileSchema = new Schema({

  // Personal Info
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  dob: { type: Date, required: true },
  cnic: { type: String, required: true, unique: true },

  // Contact Info
  phone: { type: String },
  email: { type: String, required: true },
  address: { type: String }, // Removed 'required' here
  city: { type: String },
  country: { type: String },


  // Education
  education: [
    {
      degreeTitle: { type: String },
      institution: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      verificationLevel: { type: String, enum: ["None", "Verified", "Rejected"], default: "None" },
      fileUrl: { type: String },
    },
  ],




  


  // Experience
  experience: [
    {
      jobTitle: { type: String },
      organization: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      verificationLevel: { type: String, enum: ["None", "Verified", "Rejected"], default: "None" },
      fileUrl: { type: String },
    },
  ],

  // Additional Info
  skills: [String],
  languages: [String],
  maritalStatus: { type: String, enum: ["Single", "Married", "Divorced", "Widowed"] },
  nationality: { type: String },

  // Images
  profileImageUrl: { type: String },
  pdfUrl: { type: String },

  // Visibility
  visibility: {
    type: String,
    enum: ["Public", "Private", "Hide"],
    default: "Private",
  },

  createdAt: { type: Date, default: Date.now },
});

// ❌ Removed duplicate index definition (no .index({ cnic: 1 }))

const ProfileModel = mongoose.model("ProfileSubmission", ProfessionalProfileSchema);
export default ProfileModel;

