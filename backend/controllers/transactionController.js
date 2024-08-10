import mongoose from "mongoose";
import Transaction from "../Models/transactionModel.js";
import Account from "../Models/accountModel.js";

// Helper function to get account by account number
const getAccountByNumber = async (accountNumber, session) => {
  return await Account.findOne({ accountNumber }).session(session);
};

// a. Deposit cash
export const deposit = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount } = req.body;

    const accountNumber = req.account.accountNumber;

    const account = await getAccountByNumber(accountNumber, session);
    if (!account) {
      throw new Error("Account not found");
    }

    const oldBalance = account.balance;
    account.balance += amount;

    const transaction = new Transaction({
      transactionDetails: { accountId: account._id },
      type: "Deposit",
      amount,
      balance: { before: oldBalance, after: account.balance },
    });

    account.transactions.push(transaction._id);

    await account.save({ session });
    await transaction.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      message: "Deposit successful",
      transaction,
      newBalance: account.balance,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: "Deposit failed", error: error.message });
  } finally {
    session.endSession();
  }
};

// b. Withdraw cash
export const withdraw = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount } = req.body;
    const accountNumber = req.account.accountNumber;

    const account = await getAccountByNumber(accountNumber, session);
    if (!account) {
      throw new Error("Account not found");
    }

    if (account.balance < amount) {
      throw new Error("Insufficient funds");
    }

    const oldBalance = account.balance;
    account.balance -= amount;

    const transaction = new Transaction({
      transactionDetails: { accountId: account._id },
      type: "Withdrawal",
      amount,
      balance: { before: oldBalance, after: account.balance },
    });

    account.transactions.push(transaction._id);

    await account.save({ session });
    await transaction.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      message: "Withdrawal successful",
      transaction,
      newBalance: account.balance,
    });
  } catch (error) {
    await session.abortTransaction();
    res
      .status(400)
      .json({ message: "Withdrawal failed", error: error.message });
  } finally {
    session.endSession();
  }
};

// c. Transfer funds
export const transfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { toAccountNumber, amount } = req.body;
    const fromAccountNumber = req.account.accountNumber;

    const fromAccount = await getAccountByNumber(fromAccountNumber, session);
    const toAccount = await getAccountByNumber(toAccountNumber, session);

    if (!toAccount) {
      throw new Error("Receiving account not found");
    }

    if (fromAccount.balance < amount) {
      throw new Error("Insufficient funds");
    }

    const oldFromBalance = fromAccount.balance;
    fromAccount.balance -= amount;

    const oldToBalance = toAccount.balance;
    toAccount.balance += amount;

    const transaction = new Transaction({
      transactionDetails: {
        accountId: fromAccount._id,
        toAccount: toAccount._id,
      },
      type: "Transfer",
      amount,
      balance: { before: oldFromBalance, after: fromAccount.balance },
    });

    fromAccount.transactions.push(transaction._id);
    toAccount.transactions.push(transaction._id);

    await fromAccount.save({ session });
    await toAccount.save({ session });
    await transaction.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      message: "Transfer successful",
      transaction,
      newSenderBalance: fromAccount.balance,
      newReceiverBalance: toAccount.balance,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: "Transfer failed", error: error.message });
  } finally {
    session.endSession();
  }
};

// d. Get transaction history with filters
export const getTransactionHistory = async (req, res) => {
  try {
    const accountNumber = req.user.accountNumber;
    const { startDate, endDate, type, minAmount, maxAmount } = req.query;

    const account = await getAccountByNumber(accountNumber);

    if (!account) {
      throw new Error("Account not found");
    }

    let query = { _id: { $in: account.transactions } };

    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (type) {
      query.type = type;
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({
      message: "Failed to retrieve transaction history",
      error: error.message,
    });
  }
};
