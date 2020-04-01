const express = require("express");
const { check } = require("express-validator");

const User = require("../models/user");

const authController = require("../controllers/auth");

const router = express.Router();

router.put(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please, enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              "Email address already exists!, [routes/auth.js => router.put()]"
            );
          }
        });
      })
      .normalizeEmail(),
    check("password")
      .isLength({ min: 3 })
      .trim(),
    check("name")
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

router.post("/login", authController.login);

module.exports = router;
