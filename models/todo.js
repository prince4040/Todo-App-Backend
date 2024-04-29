const { DateTime } = require("luxon");
const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    // required: true,
  },

  dueDate: {
    type: Date,
    default: () => DateTime.now().plus({ days: 1 }).toJSDate(),
  },

  completed: {
    type: Boolean,
    default: false,
  },

  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
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

TodoSchema.pre("save", function (next) {
  //updatedAt field
  if (!this.isNew) {
    this.updatedAt = new Date();
  }

  next();
});

module.exports = mongoose.model("Todo", TodoSchema);
