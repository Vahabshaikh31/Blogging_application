const { mongoose, Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/public/images/user-avatar.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password before saving it
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt with a saltRounds of 10
    this.password = await bcrypt.hash(this.password, salt); // Hash the password with the salt
    next();
  } catch (err) {
    next(err);
  }
});

// Static method to compare the provided password with the stored hashed password
userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("User Not Found");

    const isMatch = await bcrypt.compare(password, user.password); // Compare the plain password with the hashed one

    if (!isMatch) throw new Error("Incorrect Password");

    const token = createTokenForUser(user);
    return token;
  }
);

const User = model("User", userSchema);
module.exports = User;
