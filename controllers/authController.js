const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../middlewares/authGenerateToken");

exports.signup = async (req, res, next) => {
  try {
    const userExisted = await User.findOne({ where: { mail: req.body.mail } });
    if (userExisted) {
      return res
        .status(409)
        .json({ success: false, message: "user mail already exist" });
    }
    const hashed = await bcrypt.hash(req.body.password, 10);
    if (!hashed) {
      return res.status(500).json(err);
    }
    const user = await User.create({
      username: req.body.username,
      mail: req.body.mail,
      phoneno: req.body.phoneno,
      password: hashed,
    });
    const { password, updatedAt, createdAt, ...userDetails } = user.dataValues;
    if (user) {
      let token = await generateToken({
        username: user.dataValues.username,
        id: user.dataValues.id,
        password: user.dataValues.password,
      });
      return res.status(201).json({
        success: true,
        message: "created successfully",
        token: token,
        username: userDetails.username,
        userId: userDetails.id,
      });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "something went wrong" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: `something went wrong: ${e}` });
  }
};

exports.login = async (req, res, next) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    if (!hashed) {
      return res.status(500).json(err);
    }
    const user = await User.findOne({ where: { mail: req.body.mail } });
    if (!user) {
      return res
        .status(403)
        .send({ success: "false", message: "invalid mail or password" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      const { password, updatedAt, createdAt, ...userDetails } =
        user.dataValues;
      const token = await generateToken({
        username: user.dataValues.username,
        id: user.dataValues.id,
        password: user.dataValues.password,
      });
      return res.status(201).json({
        success: true,
        message: "login successfully",
        token: token,
        username: userDetails.username,
        userId: userDetails.id,
      });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Credentials are not correct" });
    }
  } catch (e) {
    return res
      .status(401)
      .json({ success: false, message: `something went wrong: ${e}` });
  }
};
