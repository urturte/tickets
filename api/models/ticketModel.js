const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema({
  title: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  fromLocation: { type: String, required: true },
  toLocation: { type: String, required: true },
  toLocationPhotoURL: { type: String },
});

module.exports = mongoose.model("Ticket", ticketSchema);
