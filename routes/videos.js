const express = require("express");
const { body } = require("express-validator");
const { loginRequired } = require("../middlewares/authentication");
const { validate } = require("../middlewares/validator");
const {
  createVideo,
  getVideo,
  getVideoById,
  getVideosByUser,
  updateVideo,
  deleteVideo,
  updateView,
} = require("../controllers/video.controller");
const router = express.Router();

router.post(
  "/",
  validate([
    body("title", "Invalid title").exists().notEmpty(),
    body("videoUrl", "Invalid video").exists().notEmpty(),
    body("category", "Invalid category").exists().notEmpty(),
    body("collection", "Invalid collection").exists().notEmpty(),
    body("duration", "Invalid duration").exists().notEmpty(),
    // body("material", "Invalid material").exists().notEmpty(),
    body("difficulty", "Invalid difficulty").exists().notEmpty(),
    // body("tool", "Invalid tool").exists().notEmpty(),
  ]),
  createVideo
);
router.get("/", getVideo);
router.get("/:id", getVideoById);
router.get("/user/:id", loginRequired, getVideosByUser);
router.put("/:id", loginRequired, updateVideo);
router.delete("/:id", loginRequired, deleteVideo);
router.put("/view/:id", updateView);

module.exports = router;
