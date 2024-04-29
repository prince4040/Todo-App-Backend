const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { DateTime } = require("luxon");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

UserSchema.pre("save", async function (next) {
  //hash the password
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  //update the updatedAt field before saving the document
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
