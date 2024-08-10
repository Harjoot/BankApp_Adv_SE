import mongoose from "mongoose";
import Account from "../Models/accountModel.js";
import PersonalInfo from "../Models/personalInfoModel.js";
import AccountDetails from "../Models/accountDetailsModel.js";
import LegalCompliance from "../Models/legalComplianceModel.js";
import SecurityInfo from "../Models/securityInfoModel.js";
import SystemField from "../Models/systemFieldsModel.js";

const eraseAccount = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const accountNumber = req.account.accountNumber;

    if (!accountNumber) {
      throw new Error("Account number not found in request");
    }

    // Find the account
    const account = await Account.findOne({ accountNumber }).session(session);

    if (!account) {
      throw new Error("Account not found");
    }

    // Prepare delete operations for related documents
    const deleteOperations = [
      PersonalInfo.findByIdAndDelete(account.personalInfo).session(session),
      AccountDetails.findByIdAndDelete(account.accountDetails).session(session),
      LegalCompliance.findByIdAndDelete(account.legalCompliance).session(
        session
      ),
      SecurityInfo.findByIdAndDelete(account.securityInfo).session(session),
      SystemField.findByIdAndDelete(account.systemFields).session(session),
    ];

    // Execute all delete operations
    await Promise.all(deleteOperations);

    // Delete the main account document
    await Account.deleteOne({ _id: account._id }).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    res
      .status(400)
      .json({ message: "Account deletion failed", error: error.message });
  } finally {
    session.endSession();
  }
};

export { eraseAccount };
