const express = require("express");
const {
  createTask,
  getAllUsers,
  deleteUser,
  getAllTask,
  deleteTask,
  updateTask,
} = require("../controllers/adminController");
const authentication = require("../middlewares/authentication");
const authorizationAdmin = require("../middlewares/authorizationAdmin");
const router = express.Router();

router.use(authentication);
router.use(authorizationAdmin);
router.get("/all-users", getAllUsers);
router.delete("/user/:id", deleteUser);

// ACTION TASK
router.post("/task", createTask);
router.get("/task", getAllTask);
router.put("/task/:taskId/user/:userId", updateTask);
router.delete("/task/:taskId", deleteTask);

module.exports = router;
