const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.SIGN_UP = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const upperCaseName = req.body.name;
  const user = new UserSchema({
    name: upperCaseName.charAt(0).toUpperCase() + upperCaseName.slice(1),
    email: req.body.email,
    password: hashedPassword,
    ticketsBought: [],
    moneyBalance: req.body.moneyBalance,
  });
  user
    .save()
    .then((result) => {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" },
        { algorythm: "RS256" }
      );
      const refreshToken = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
        { algorythm: "RS256" }
      );

      return res.status(200).json({
        response: "User was created successfully",
        user: result,
        jwt_token: token,
        jwt_refresh_token: refreshToken,
      });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(400).json({ response: "Validation unsuccessful" });
    });
};

module.exports.LOGIN = async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email });

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    console.log(user);

    if (isPasswordMatch) {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        { algorythm: "RS256" }
      );
      const refreshToken = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
        { algorythm: "RS256" }
      );

      return res.status(200).json({
        status: "login successfull",
        jwt_token: token,
        jwt_refresh_token: refreshToken,
      });
    }
  } catch (err) {
    console.log("err", err);
    return res.status(401).json({
      status: "Login failed. Please enter valid email and/or password.",
    });
  }
};

// module.exports.GET_NEW_JWT = async function (req, res) {
//   try {
//     const user = await UserSchema.findOne({ email: req.body.email });

//     const isPasswordMatch = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );

//     console.log(user);

//     if (isPasswordMatch) {
//       const token = jwt.sign(
//         {
//           email: user.email,
//           userId: user._id,
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: "1h" },
//         { algorythm: "RS256" }
//       );
//       const refreshToken = jwt.sign(
//         {
//           email: user.email,
//           userId: user._id,
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: "24h" },
//         { algorythm: "RS256" }
//       );

//       return res.status(200).json({
//         status: "login successfull",
//         jwt_token: token,
//         jwt_refresh_token: refreshToken,
//       });
//     }
//   } catch (err) {
//     console.log("err", err);
//     return res.status(401).json({
//       status: "Login failed. Please enter valid email and/or password.",
//     });
//   }
// };

module.exports.GET_ALL_USERS = async function (req, res) {
  const data = await UserSchema.find().sort(" name");

  console.log(data);

  return res.status(200).json({ users: data });
};

module.exports.GET_USER_BY_ID = async (req, res) => {
  const user = await UserSchema.findOne({ _id: req.params.id })
    .then((result) => {
      return res.status(200).json({ user: result });
    })
    .catch((err) => {
      console.log("err", err);
      res
        .status(404)
        .json({ response: "The user ID you entered does not exist" });
    });
};

module.exports.GET_USERS_WITH_TICKETS = async (req, res) => {
  const data = await UserSchema.aggregate([
    {
      $lookup: {
        from: "tickets",
        localField: "ticketsBought",
        foreignField: "_id",
        as: "userTickets",
      },
    },
  ]).exec();

  console.log(data);

  return res.status(200).json({ usersWithTickets: data });
};

module.exports.GET_USER_BY_ID_WITH_TICKETS = async (req, res) => {
  const data = await UserSchema.aggregate([
    {
      $lookup: {
        from: "tickets",
        localField: "ticketsBought",
        foreignField: "_id",
        as: "userTickets",
      },
    },
    { $match: { _id: ObjectId(req.params.id) } },
  ]).exec();

  console.log(data);

  return res.status(200).json({ userWithTickets: data });
};
