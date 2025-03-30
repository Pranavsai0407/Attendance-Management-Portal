const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
  //console.log(req.cookies);
  //console.log(1);
  const token = req.cookies.token;
  //console.log(token);
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    //console.log(decoded);
    req.user = decoded;  // Attach the user info to the request object
    
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports =  {authenticateToken};