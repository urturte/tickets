const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const userController = require("../controllers/users");

router.post("/signUp", userController.SIGN_UP);

router.post("/login", userController.LOGIN);

// router.get("/getNewJwtToken", auth, userController.GET_NEW_JWT);

router.get("/getAllUsers", auth, userController.GET_ALL_USERS);

router.get("/getUserById/:id", auth, userController.GET_USER_BY_ID);

router.get(
  "/getAllUsersWithTickets",
  auth,
  userController.GET_USERS_WITH_TICKETS
);

router.get(
  "/getAllUserByIdWithTickets/:id",
  auth,
  userController.GET_USER_BY_ID_WITH_TICKETS
);

module.exports = router;
