const User = require("../models/userModel");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const { password, createdAt, updatedAt, id, mail, ...details } =
      user.dataValues;
    return res.json({ success: true, user: details });
  } catch (e) {
    return res
      .status(401)
      .json({ success: false, message: `something went wrong: ${e}` });
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    await User.update(req.body, {
      where: {
        id: req.user.id,
      },
    });
    return res.json({ success: true });
  } catch (e) {
    return res
      .status(401)
      .json({ success: false, message: `something went wrong: ${e}` });
  }
};
