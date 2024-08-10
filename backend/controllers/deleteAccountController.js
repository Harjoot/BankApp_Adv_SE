import mongoose from "mongoose";
import Account from "../Models/accountModel.js";
import PersonalInfo from "../Models/personalInfoModel.js";
import AccountDetails from "../Models/accountDetailsModel.js";
import LegalCompliance from "../Models/legalComplianceModel.js";
import SecurityInfo from "../Models/securityInfoModel.js";
import SystemField from "../Models/systemFieldsModel.js";
import Transaction from "../Models/transactionModel.js";

// Delete Account
const deleteAccount = async (req, res) => {
  const { accountNumber } = req.params;

  if (!accountNumber) {
    return res.status(400).json({ error: "AccountNumber is required" });
  }

  try {
    // Find the account and its related documents
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

    // Define deletion promises for related documents
    const deletePromises = [];

    if (account.personalInfo) {
      deletePromises.push(
        PersonalInfo.findByIdAndDelete(account.personalInfo._id)
      );
    }
    if (account.accountDetails) {
      deletePromises.push(
        AccountDetails.findByIdAndDelete(account.accountDetails._id)
      );
    }
    if (account.legalCompliance) {
      deletePromises.push(
        LegalCompliance.findByIdAndDelete(account.legalCompliance._id)
      );
    }
    if (account.securityInfo) {
      deletePromises.push(
        SecurityInfo.findByIdAndDelete(account.securityInfo._id)
      );
    }
    if (account.systemFields) {
      deletePromises.push(
        SystemField.findByIdAndDelete(account.systemFields._id)
      );
    }
    if (account.transactions) {
      deletePromises.push(
        Transaction.findByIdAndDelete(account.transactions._id)
      );
    }

    // Execute all deletion promises
    await Promise.all(deletePromises);

    // Delete the main account
    await Account.findOneAndDelete({ accountNumber });

    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export { deleteAccount };
