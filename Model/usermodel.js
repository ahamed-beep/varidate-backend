import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  
  // 🔑 Verification via code
  verificationCode: { type: String },
  codeExpiresAt: { type: Date },
  resetCode: { type: String },
resetCodeExpiresAt: { type: Date },

});

const User = mongoose.model("User", userSchema);

export default User;
