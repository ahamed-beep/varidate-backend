import User from "../Model/usermodel.js";
import bcrypt from 'bcrypt';
import crypto from "crypto";
import nodemailer from "nodemailer";

export const signupcontroller = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Check for existing verified user first
    const existingVerifiedUser = await User.findOne({ 
      email, 
      verified: true 
    });

    if (existingVerifiedUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check for any existing user (regardless of verification status)
    let user = await User.findOne({ email });

    if (user) {
      // If user exists but isn't verified, update their record
      user.firstname = firstname;
      user.lastname = lastname;
      user.password = await bcrypt.hash(password, 10);
      user.verificationCode = verificationCode;
      user.codeExpiresAt = codeExpiresAt;
      user.verified = false;
      await user.save();
    } else {
      // Create new user if doesn't exist
      user = await User.create({
        firstname,
        lastname,
        email,
        password: await bcrypt.hash(password, 10),
        verificationCode,
        codeExpiresAt,
        verified: false
      });
    }

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "askmobisoft55@gmail.com",
        pass: "bitw mduw ylst tdgh"
      }
    });

    const mailOptions = {
      from: "askmobisoft55@gmail.com",
      to: email,
      subject: "Verify Your Email",
      html: `
        <h3>Hello ${firstname},</h3>
        <p>Your verification code is:</p>
        <h2>${verificationCode}</h2>
        <p>This code is valid for 10 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      message: "Verification code sent to email.",
      email: user.email // Include email in response for client-side use
    });

  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ 
      message: "Something went wrong",
      error: err.message // Include error message for debugging
    });
  }
};


export const verifyCodeController = async (req, res) => {
  try {
    const { email, code } = req.body;
    
    // Check if user exists in pending state
    const user = await User.findOne({ 
      email,
      verified: false,
      verificationCode: code,
      codeExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification code." });
    }

    // Mark as verified and clear verification fields
    user.verified = true;
    user.verificationCode = undefined;
    user.codeExpiresAt = undefined;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully!" });

  } catch (err) {
    console.error("Verification error:", err);
    return res.status(500).json({ message: "Verification failed." });
  }
};

export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.verified) {
      return res.status(400).json({ message: "Account already verified or doesn't exist." });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    user.verificationCode = verificationCode;
    user.codeExpiresAt = codeExpiresAt;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "askmobisoft55@gmail.com",
        pass: "bitw mduw ylst tdgh"
      }
    });

    const mailOptions = {
      from: "askmobisoft55@gmail.com",
      to: email,
      subject: "Resend: Verify Your Email",
      html: `
        <h3>Hello ${user.firstname},</h3>
        <p>Your new verification code is:</p>
        <h2>${verificationCode}</h2>
        <p>This code is valid for 10 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "New verification code sent." });

  } catch (err) {
    console.error("Resend code error:", err);
    return res.status(500).json({ message: "Failed to resend verification code." });
  }
};


// ✅ 3. Login Controller
export const logincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;

    const loginuser = await User.findOne({ email });
    if (!loginuser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Strict check - user must be verified
    if (loginuser.verified !== true) {
      return res.status(403).json({ 
        message: "Please verify your email before logging in. Check your email for verification code." 
      });
    }

    const isMatch = await bcrypt.compare(password, loginuser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    res.status(200).json({ 
      message: "Login successful.",
      user: {
        email: loginuser.email,
        verified: loginuser.verified
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Login failed." });
  }
};
