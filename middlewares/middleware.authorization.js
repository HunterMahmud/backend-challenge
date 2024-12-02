module.exports = (req, res, next) => {
    const authToken = req.headers['authorization'];
    if (!authToken || authToken !== `Bearer ${process.env.AUTH_TOKEN}`) {
      return res.status(401).json({ message: 'Unauthorized access.'});
    }
    next();
  };
  