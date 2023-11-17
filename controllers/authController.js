const { comparePassword } = require("../helpers/bcrypt");
const {
  handleServerError,
  handleClientError,
} = require("../helpers/handleError");
const { generateToken } = require("../helpers/jwt");
const { User } = require("../models");
const Joi = require("joi");

exports.register = async (req, res) => {
  try {
    const { name, password, email, phone, domicile, role } = req.body;

    const userSchema = Joi.object({
      name: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().email().required(),
      role: Joi.number(),
      phone: Joi.string().required(),
      domicile: Joi.string().required(),
    });
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    }

    const existingPhone = await User.findOne({
      where: {
        phone: phone,
      },
    });
    console.log(existingPhone);

    if (existingPhone) {
      return handleClientError(res, 400, "Phone number already exists");
    }

    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return handleClientError(res, 400, "Email has already exists");
    }

    const newUser = await User.create(
      {
        name,
        password,
        email,
        phone,
        domicile,
        role,
      },
      {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      }
    );

    res
      .status(201)
      .json({ data: newUser, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.login = async (req, res) => {
  try {
    const { password, email } = req.body;

    const userSchema = Joi.object({
      password: Joi.string().required(),
      email: Joi.string().email().required(),
    });

    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    }

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    const passwordMatch = comparePassword(password, user.password);

    if (!passwordMatch) {
      return handleClientError(res, 401, "Invalid email or password");
    }

    // Generate token kalo email dan password cocok
    const token = generateToken(user.id, user.role);

    const dataResponse = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    res.status(200).json({
      token: token,
      message: "Login successful",
      data: dataResponse,
    });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};
