import jwt from "jsonwebtoken";
import Account from "../Models/accountModel.js"; // Import your Account model

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(" ")[1]; // Assumes Bearer token

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace JWT_SECRET with your secret key

    // Get account from database
    const account = await Account.findOne({ _id: decoded.accountId });
    if (!account) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach account info to request
    req.account = account;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Authentication failed", error: error.message });
  }
};

export default authMiddleware;
