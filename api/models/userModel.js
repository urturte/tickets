const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: [true, "Can't be blank"] },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Can't be blank"],
    match: [/\S+@\S+\.\S+/, "Email is invalid"],
  },
  password: {
    type: String,
    isLength: {
      options: [{ min: 6 }],
      errorMessage: "Must be at least 6 characters",
    },
    matches: {
      options: ["(?=.*[a-zA-Z])(?=.*[0-9]+).*", "g"],
      errorMessage: "Password must be alphanumeric.",
    },
  },
  ticketsBought: { type: Array },
  moneyBalance: { type: Number },
});

module.exports = mongoose.model("User", userSchema);
