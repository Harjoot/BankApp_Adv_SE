import Account from "../Models/accountModel.js";
import mongoose from "mongoose";

//get all accounts
const getAccounts = async (req, res) => {
  const account = await Account.find({})
    .populate("personalInfo")
    .populate("accountDetails")
    .populate("legalCompliance")
    .populate("securityInfo")
    .populate("systemFields")
    .populate("transactions");

  res.status(200).json(account);
};

//get One account
const getAccount = async (req, res) => {
  const { accountNumber } = req.params;

  if (!accountNumber) {
    return res.status(400).json({ error: "AccountNumber is required" });
  }

  try {
    const account = await Account.findOne({ accountNumber })
      .populate("personalInfo")
      .populate("accountDetails")
      .populate("legalCompliance")
      .populate("securityInfo")
      .populate("systemFields")
      .populate("transactions");

    if (!account) {
      return res.status(404).json({ error: "No such Account" });
    }
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// get Account specific to a user
const getUserAccount = async (req, res) => {
  const { accountNumber } = req.params;

  if (!accountNumber) {
    return res.status(400).json({ error: "AccountNumber is required" });
  }

  try {
    const account = await Account.findOne({ accountNumber })
      .populate("personalInfo")
      .populate("accountDetails")
      .populate("legalCompliance")
      .populate("securityInfo")
      .populate("systemFields")
      .populate({
        path: "transactions",
        options: {
          sort: { createdAt: -1 },
        },
      });

    if (!account) {
      return res.status(404).json({ error: "No such Account haha" });
    }

    return res.status(200).json(account);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export { getAccount, getAccounts, getUserAccount };
