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
    type: String,
    immutable: true,
    default: () => DateTime.now().toISO(),
  },
  updatedAt: {
    type: String,
    default: () => DateTime.now().toISO(),
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  //update the updatedAt field before saving the document
  if (!this.isNew) {
    this.updatedAt = DateTime.now().toISO();
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
