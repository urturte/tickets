const express = require("express");
const bodyParser = require("body-parser");
const usersRoutes = require("./api/routes/users");
const ticketsRoutes = require("./api/routes/tickets");

const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

mongoose
  .connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true })
  .then(console.log("connected"))
  .catch((err) => {
    console.log("Connection error");
    console.log(err);
  });

app.use(usersRoutes);
app.use(ticketsRoutes);

app.listen(3000);
