const express = require("express");
const {
  updateUser,
  changePassword,
  getUserById,
  updateTaskUser,
  forgotPassword,
} = require("../controllers/userController");
const authentication = require("../middlewares/authentication");
const router = express.Router();

router.get("/:id", authentication, getUserById);
router.put("/update/:id", authentication, updateUser);
router.put("/password/:id", authentication, changePassword);
router.post("/forgot", forgotPassword)

router.put("/:id/task/:taskId", authentication, updateTaskUser);

module.exports = router;
