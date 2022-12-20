const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const ticketController = require("../controllers/tickets");

router.post("/createTicket", ticketController.CREATE_TICKET);

router.post("/buyTicket/:id", auth, ticketController.BUY_TICKET);

module.exports = router;
