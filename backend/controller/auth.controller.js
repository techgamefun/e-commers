const User = require("../model/user.model");

//========== User Register Controller ==========
exports.register = async (req, res, next) => {
  const { firstName, lastName, email, phone, password, address } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.send("user is already exist");
  }

  const user = await User.create({});

  res.send({ user });
};
