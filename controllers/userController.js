const { comparePassword, hashingPassword } = require("../helpers/bcrypt");
const {
  handleServerError,
  handleClientError,
} = require("../helpers/handleError");
const { sendMail } = require("../helpers/mailer");
const generateRandomPassword = require("../helpers/randomPassword");
const resetPasswordMessage = require("../helpers/textForgot");
const { User, Task } = require("../models");
const Joi = require("joi");

exports.getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const loggedInUserId = req.user.id;

    if (userId !== loggedInUserId) {
      return handleClientError(
        res,
        403,
        "Forbidden: You can only view your own account"
      );
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
      include: {
        model: Task,
        as: "tasks",
        attributes: { exclude: ["createdAt", "updatedAt", "userName"] },
      },
    });

    if (!user) {
      return handleClientError(res, 404, "User not found");
    }

    res.status(200).json({ data: user, message: "Successfully get user by id"});
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, password, email, phone, domicile } = req.body;
    const loggedInUserId = req.user.id;

    if (userId !== loggedInUserId) {
      return handleClientError(
        res,
        403,
        "Forbidden: You can only update your own account"
      );
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return handleClientError(res, 404, "User not found");
    }

    await user.update({
      name: name || user.name,
      phone: phone || user.phone,
      domicile: domicile || user.domicile
    })


    const updatedUserData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      domicile: user.domicile,
      role: user.role,
    };

    res
      .status(200)
      .json({ data: updatedUserData, message: "Successfully updated user" });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { oldPassword, newPassword } = req.body;
    const loggedInUserId = req.user.id;

    if (userId !== loggedInUserId) {
      return handleClientError(
        res,
        403,
        "Forbidden: You can only change your own password"
      );
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return handleClientError(res, 404, "User not found");
    }

    const passwordMatch = comparePassword(oldPassword, user.password);
    if (!passwordMatch) {
      return handleClientError(res, 401, "Invalid old password");
    }

    user.password = hashingPassword(newPassword);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return handleClientError(res, 404, "User not found");
    }

    const randomPassword = generateRandomPassword();
    const hashed = hashingPassword(randomPassword);

    user.password = hashed;
    await user.save();

    const message = resetPasswordMessage(user.name, randomPassword);

    await sendMail(email, "Forgot Password", message);

    res.status(200).json({ message: "Reset password email sent successfully" });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.updateTaskUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const taskId = parseInt(req.params.taskId);
    const { status } = req.body;
    const loggedInUserId = req.user.id;

    if (userId !== loggedInUserId) {
      return handleClientError(
        res,
        403,
        "Forbidden: You can only update your own tasks"
      );
    }

    const task = await Task.findOne({
      where: {
        id: taskId,
        userId: userId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!task) {
      return handleClientError(res, 404, "Task not found for this user");
    }

    task.status = status;
    await task.save();

    res
      .status(200)
      .json({ data: task, message: "Task status updated successfully" });
  } catch (error) {
    return handleServerError(res);
  }
};
