const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  return res.status(200).send({ data: { key: "value" }, message: "success" });
});

const userRoutes = require("./users.js");
router.use("/users", userRoutes);

const videoRoutes = require("./videos.js");
router.use("/videos", videoRoutes);

module.exports = router;
