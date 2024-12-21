import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,

      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);
// Hash password before saving user
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // Check if the password is modified
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Check if the provided password matches the stored hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access Token
// userSchema.methods.generateAccessToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//       username: this.username,
//     },
//     process.env.ACCESS_TOKEN_SECRET,
//     {
//       expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
//     }
//   );
// };

// userSchema.methods.generateRefreshToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//       username: this.username,
//     },
//     process.env.REFRESH_TOKEN_SECRET,
//     {
//       expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
//     }
//   );
// };

export const User = mongoose.model("User", userSchema);
