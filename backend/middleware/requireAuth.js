const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  // verify Authentication token
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      status: 401,
      error: 'Authorization token is missing',
    });
  }
  const token = authorization.split(' ')[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = await User.findById(_id).select('_id');
    // req.user = await User.findOne({_id}).select('_id');
    next();

  } catch (err) {
    console.log(err);
    return res.status(401).json({
      status: 401,
      error: 'Authorization token is invalid',
    });
  }
}

module.exports = requireAuth;