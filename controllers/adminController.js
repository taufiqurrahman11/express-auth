const Joi = require("joi");
const {
  handleServerError,
  handleClientError,
} = require("../helpers/handleError");
const { User, Task } = require("../models");

exports.getAllTask = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 1) {
      return handleClientError(res, 403, "Only admins can get all tasks");
    }

    const allTasks = await Task.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    return res.status(200).json({ data: allTasks });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, userId } = req.body;

    const taskSchema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      status: Joi.string().valid('pending', 'in-progress', 'completed').required(),
      userId: Joi.number().required(),
    });
    const { error } = taskSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const task = await Task.create({
      title,
      description,
      status,
      userId,
      userName: user.name,
    });

    const newTask = await Task.findByPk(task.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    return res
      .status(201)
      .json({ task: newTask, message: "Task created successfully" });
  } catch (error) {
    console.log(error)
    return handleServerError(res);
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 1) {
      return handleClientError(res, 403, "Only admins can update tasks title and description");
    }

    const taskId = parseInt(req.params.taskId);
    const userId = parseInt(req.params.userId);
    const { title, description, status } = req.body;

    const task = await Task.findByPk(taskId);

    const user = await User.findByPk(userId);

    if (!user) {
      return handleClientError(res, 404, "User not found");
    }

    if (!task) {
      return handleClientError(res, 404, "Task not found");
    }

    if (task.userId !== userId) {
      return handleClientError(res, 403, "User has no task");
    }

    

    await task.update({
      title: title || task.title,
      description: description || task.description,
      status: status || task.status,
      userId: userId || task.userId,
      userName: user.name
    });

    const updatedTask = await Task.findByPk(taskId, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    return res
      .status(200)
      .json({ task: updatedTask, message: "Task updated successfully" });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 1) {
      return handleClientError(res, 403, "Only admins can delete tasks");
    }

    const taskId = parseInt(req.params.taskId);
    console.log(taskId);
    const task = await Task.findByPk(taskId);

    if (!task) {
      return handleClientError(res, 404, "Task not found");
    }

    await task.destroy();

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.findAll({
      include: {
        model: Task,
        as: "tasks",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });

    return res.status(200).json({ data: allUsers });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    console.log(user);

    if (!user) {
      return handleClientError(res, 404, "User not found");
    }

    await user.destroy();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return handleServerError(res);
  }
};
