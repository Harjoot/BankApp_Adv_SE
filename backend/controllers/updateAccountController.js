import mongoose from "mongoose";
import Account from "../Models/accountModel.js";
import PersonalInfo from "../Models/personalInfoModel.js";
import AccountDetails from "../Models/accountDetailsModel.js";
import LegalCompliance from "../Models/legalComplianceModel.js";
import SecurityInfo from "../Models/securityInfoModel.js";
import SystemField from "../Models/systemFieldsModel.js";

const updateAccount = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const accountNumber = req.account.accountNumber;

    if (!accountNumber) {
      throw new Error("Account number not found in request");
    }

    const {
      personalInfo,
      accountDetails,
      legalCompliance,
      securityInfo,
      systemFields,
    } = req.body;

    const account = await Account.findOne({ accountNumber }).session(session);

    if (!account) {
      throw new Error("Account not found");
    }

    if (req.body.account) {
      Object.assign(account, req.body.account);
    }

    const updateOperations = [];

    if (personalInfo) {
      updateOperations.push(
        PersonalInfo.findByIdAndUpdate(account.personalInfo, personalInfo, {
          new: true,
          session,
        })
      );
    }

    if (accountDetails) {
      updateOperations.push(
        AccountDetails.findByIdAndUpdate(
          account.accountDetails,
          accountDetails,
          { new: true, session }
        )
      );
    }

    if (legalCompliance) {
      updateOperations.push(
        LegalCompliance.findByIdAndUpdate(
          account.legalCompliance,
          legalCompliance,
          { new: true, session }
        )
      );
    }

    if (securityInfo) {
      updateOperations.push(
        SecurityInfo.findByIdAndUpdate(account.securityInfo, securityInfo, {
          new: true,
          session,
        })
      );
    }

    if (systemFields) {
      updateOperations.push(
        SystemField.findByIdAndUpdate(account.systemFields, systemFields, {
          new: true,
          session,
        })
      );
    }

    await Promise.all([account.save({ session }), ...updateOperations]);

    await session.commitTransaction();

    const populatedAccount = await Account.findOne({ accountNumber })
      .populate("personalInfo")
      .populate("accountDetails")
      .populate("legalCompliance")
      .populate("securityInfo")
      .populate("systemFields");

    res.status(200).json(populatedAccount);
  } catch (error) {
    await session.abortTransaction();
    console.error("Update failed:", error);
    res.status(400).json({
      message: "Update failed",
      error: error.message,
      stack: error.stack,
    });
  } finally {
    session.endSession();
  }
};

export { updateAccount };
