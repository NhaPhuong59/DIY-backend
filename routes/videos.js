const express = require("express");
const { body, header, param } = require("express-validator");
const { createUser } = require("../controllers/user.controller");
const { loginRequired } = require("../middlewares/authentication");
const { validate, checkObjectId } = require("../middlewares/validator");
const router = express.Router();

router.post(
  "/",
  validate([
    body("title", "Invalid title").exists().notEmpty(),
    body("videoUrl", "Invalid video").exists().notEmpty(),
    body("category", "Invalid category").exists().isEmail(),
    body("collection", "Invalid collection").exists().notEmpty(),
    body("duration", "Invalid duration").exists().notEmpty(),
    body("material", "Invalid material").exists().notEmpty(),
    body("difficulty", "Invalid difficulty").exists().notEmpty(),
    body("tool", "Invalid tool").exists().notEmpty(),
  ]),
  createUser
);
