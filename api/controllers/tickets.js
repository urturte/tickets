const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const auth = require("../middlewares/auth");
const TicketSchema = require("../models/ticketModel");
const UserSchema = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.CREATE_TICKET = (req, res) => {
  const ticket = new TicketSchema({
    title: req.body.title,
    ticketPrice: req.body.ticketPrice,
    fromLocation: req.body.fromLocation,
    toLocation: req.body.toLocation,
    toLocationPhotoURL: req.body.toLocationPhotoURL,
  });
  ticket.save().then((result) => {
    return res.status(200).json({
      statusMessage: "ticket added successfully",
      result: result,
    });
  });
};
module.exports.BUY_TICKET = async (req, res) => {
  const ticket = await TicketSchema.findOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      return result;
    })
    .then((ticket) => {
      return ticket;
    });
  const fund = await UserSchema.findOne({ _id: req.body.id })
    .then((result) => {
      console.log(result.moneyBalance);
      return result.moneyBalance;
    })
    .then((moneyBalance) => {
      return moneyBalance;
    });
  const balanceAfterPurchase = fund - ticket.ticketPrice;
  console.log(ticket.ticketPrice);
  console.log(fund);
  console.log(ticket.ticketPrice < fund);
  if (ticket.ticketPrice < fund) {
    UserSchema.updateOne(
      { _id: req.body.id },
      {
        moneyBalance: balanceAfterPurchase,
        $push: { ticketsBought: ticket._id },
      }
    )
      .exec()
      .then((result) => {
        return res.status(200).json({
          statusMessage: "Ticket purchased",
          moneyBalanceLeft: balanceAfterPurchase,
        });
      });
  } else {
    return res.status(400).json({ statusMessage: "Ticket purchase failed" });
  }
};
