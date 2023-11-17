const authorizationAdmin = (req, res, next) => {
  const { role } = req.user;

  if (role !== 1) {
    return res
      .status(403)
      .json({ message: "Unauthorized, only admin can hit this action" });
  }
  next();
};

module.exports = authorizationAdmin;
