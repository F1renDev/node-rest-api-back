const express = require("express");

const { check } = require("express-validator");

const userController = require("../controllers/user");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/status", isAuth, userController.getUserStatus);

router.patch(
  "/status",
  isAuth,
  [
    check("status")
      .trim()
      .not()
      .isEmpty()
  ],
  userController.updateUserStatus
);

module.exports = router;
