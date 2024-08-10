import Account from "../Models/accountModel.js";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    const { accountNumber, password } = req.body;
    const loginResult = await loginAcc(accountNumber, password);
    res.json(loginResult);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginAcc = async (accountNumber, password) => {
  try {
    // Find the account by accountNumber and populate securityInfo
    const account = await Account.findOne({ accountNumber })
      .populate("personalInfo")
      .populate("accountDetails")
      .populate("legalCompliance")
      .populate("securityInfo")
      .populate("systemFields");

    if (!account) {
      throw new Error("Account not found");
    }

    // Check if securityInfo exists
    if (!account.securityInfo) {
      throw new Error("Security information not found");
    }

    // Check the password
    const isPasswordValid = await account.securityInfo.checkPassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Generate a JWT token
    const token = jwt.sign(
      { accountId: account._id, accountNumber: account.accountNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return the account data and token
    return {
      token,
      account: {
        accountNumber: account.accountNumber,
        balance: account.balance,
        personalInfo: account.personalInfo,
        accountDetails: account.accountDetails,
        legalCompliance: account.legalCompliance,
        securityInfo: {
          // Exclude password from the returned data
          ...account.securityInfo.toObject(),
          password: undefined,
          confirmPassword: undefined,
        },
        systemFields: account.systemFields,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export { login };
