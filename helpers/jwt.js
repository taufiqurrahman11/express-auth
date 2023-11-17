const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

const generateToken = (userId, userRole) => {
  const payload = {
    id: userId,
    role: userRole,
  };

  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new Error("Token verification failed", error);
  }
};

// const extractTokenFromHeader = (req) => {
//   const bearerHeader = req.headers.authorization;

//   if (typeof bearerHeader !== "undefined") {
//     const bearer = bearerHeader.split(" ");
//     const token = bearer[1];
//     return token;
//   } else {
//     throw new Error("Authorization header is missing");
//   }
// };

module.exports = { generateToken, verifyToken };
