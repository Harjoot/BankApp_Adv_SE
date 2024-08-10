import mongoose from "mongoose";
import Account from "../Models/accountModel.js";
import PersonalInfo from "../Models/personalInfoModel.js";
import AccountDetails from "../Models/accountDetailsModel.js";
import LegalCompliance from "../Models/legalComplianceModel.js";
import SecurityInfo from "../Models/securityInfoModel.js";
import SystemField from "../Models/systemFieldsModel.js";
import { sendEmail } from "../utilities/emailService.js";

const createAccount = async (req, res) => {
  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  const {
    account,
    accountDetails,
    personalInfo,
    legalCompliance,
    securityInfo,
    systemFields,
  } = req.body;

  try {
    // Create PersonalInfo document
    const newPersonalInfo = new PersonalInfo(personalInfo);
    await newPersonalInfo.save({ session });

    // Create AccountDetails document
    const newAccountDetails = new AccountDetails(accountDetails);
    await newAccountDetails.save({ session });

    // Create LegalCompliance document
    const newLegalCompliance = new LegalCompliance(legalCompliance);
    await newLegalCompliance.save({ session });

    // Create SecurityInfo document
    const newSecurityInfo = new SecurityInfo(securityInfo);
    await newSecurityInfo.save({ session });

    // Create SystemField document
    const newSystemFields = new SystemField(systemFields);
    await newSystemFields.save({ session });

    // Create Account document with references to other documents
    const newAccount = new Account({
      ...account,
      personalInfo: newPersonalInfo._id,
      accountDetails: newAccountDetails._id,
      legalCompliance: newLegalCompliance._id,
      securityInfo: newSecurityInfo._id,
      systemFields: newSystemFields._id,
    });

    console.log("About to save");
    await newAccount.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // // Send email to the user with their account number
    // const userEmail = personalInfo.email; // Make sure the email is available in personalInfo
    // const subject = "Your Account Details";
    // const text = `Dear user,\n\nYour account has been successfully created.\n\nAccount Number: ${newAccount.accountNumber}\n\nBest regards,\nE-Bank Team`;

    // await sendEmail(userEmail, subject, text);

    res.status(201).json({
      message: "Account created successfully",
      accountId: newAccount._id,
      accountNumber: newAccount.accountNumber,
    });
  } catch (error) {
    // If an error occurred, abort the transaction
    await session.abortTransaction();
    session.endSession();

    console.error("Error creating account:", error);

    // Check if the error is related to email sending
    if (error.message.includes('Missing credentials for "PLAIN"')) {
      res.status(500).json({
        error: "Email sending failed. Please check email configuration.",
      });
    } else {
      res.status(500).json({ error: "Failed to create account" });
    }
  }
};

export { createAccount };
