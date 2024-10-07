import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["user","manager", "admin"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    country: {
      type: String,
    },
    town: {
      type: String,
    },
    area: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt the password before to Save in Database

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Check Password 

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Gerating Access Token

userSchema.methods.generateAccessToken = async function () {
  try {
    const accessToken = await jwt.sign(
      {
        id: this._id,
        email: this.email,
        userType: this.userType,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
    return accessToken;
  } catch (error) {
    console.log(`Error while generating access Token ${error}`)
  }
};

//Generate the Token for Reset  


userSchema.methods.generatePasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  console.log(`Reset Token: ${resetToken}`);

  // Hash and set the token and expiration date
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour expiration

  // Save user after setting the reset token
  await this.save({ validateBeforeSave: false }); // Skip validation if not needed

  return resetToken; // Return the plain token for sending via email
};
// Verify the Token 

userSchema.methods.verifyResetToken = function (token) {

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log(`hasedToken ${hashedToken}`)
  return (
    hashedToken === this.resetPasswordToken &&this.resetPasswordExpires > Date.now()
  );
};

// Reset Password

userSchema.methods.resetPassword = async function (newPassword) {
  console.log(`Passwod ${newPassword}`)
  // const changedPassword= await bcrypt.hash(newPassword, 10);
  // console.log(`Changed Password ${changedPassword}`)
  this.password =newPassword
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;
  await this.save();
};

export const User = mongoose.model("User", userSchema);
