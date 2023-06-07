import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config({});

const verifyToken = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    console.log(decodedToken);
    req.userData = { userId: decodedToken.id, role: decodedToken.role };
    next();
  } catch (err) {
    res.status(401).send("Authentication failed");
  }
};

export { verifyToken };
