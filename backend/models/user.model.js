import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    isChurchgoer: {
      type: Boolean,
      required: true,
    },
    // Fields for churchgoers
    firstName: {
      type: String,
      required: function () {
        return this.isChurchgoer;
      },
    },
    lastName: {
      type: String,
      required: function () {
        return this.isChurchgoer;
      },
    },
    username: {
      type: String,
      required: function () {
        return this.isChurchgoer;
      },
      unique: true,
    },
    // Fields for church representatives
    churchName: {
      type: String,
      required: function () {
        return !this.isChurchgoer;
      },
    },
    // Common fields
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model("User", userSchema);
