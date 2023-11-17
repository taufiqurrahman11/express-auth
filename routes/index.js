const express = require("express");
const userRoute = require("./userRoute");
const adminRoute = require("./adminRoute");
const authRoute = require("./authRoute");
const router = express.Router();

router.use("/", authRoute);
router.use("/user", userRoute);
router.use("/admin", adminRoute);

module.exports = router;
