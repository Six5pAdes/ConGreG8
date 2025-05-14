import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: [
        "churchgoer",
        "churchRep"
      ],
      required: true,
      default: "churchgoer",
    },
    // Fields for churchgoers
    firstName: {
      type: String,
      required: function () {
        return this.userType === "churchgoer";
      },
    },
    lastName: {
      type: String,
      required: function () {
        return this.userType === "churchgoer";
      },
    },
    username: {
      type: String,
      required: function () {
        return this.userType === "churchgoer";
      },
    },
    // Fields for church representatives
    churchName: {
      type: String,
      required: function () {
        return this.userType === "churchRep";
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
    churches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Church",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false, // to remove __v field
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
