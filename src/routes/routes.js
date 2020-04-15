const express = require("express");
const router = express.Router();

router.use("/users", require("./userController"));
router.use("/posts", require("./postController"));
router.use("/seeds", require("./seedController"));

module.exports = router;
