const Authorize = (permittedRole) => {
  return (req, res, next) => {
    try {
      const role = req.user.role;
      if (permittedRole.includes(role)) {
        next();
      } else {
        res.status(404).send(`UserRole is not authorized `);
      }
    } catch (error) {
      res.status(404).send("Unauthorized access");
    }
  };
};

module.exports = Authorize;
