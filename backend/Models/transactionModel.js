import mongoose from "mongoose";
import crypto from 'crypto';

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
    },
    transactionDetails: {
      accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
      },
      toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
    },
    type: {
      type: String,
      enum: ["Deposit", "Withdrawal", "Transfer"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    balance: {
      before: Number,
      after: Number,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Cancelled"],
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

function generateTransactionID() {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
}

// Pre-save hook to set the account number if it doesn't exist
transactionSchema.pre('save', async function(next) {
  if (!this.transactionId) {
    let transactionId;
    let isUnique = false;
    
    // Keep generating until we find a unique transaction ID
    while (!isUnique) {
      transactionId = generateTransactionID();
      // Check if this transaction ID already exists
      const existingID = await this.constructor.findOne({ transactionId });
      if (!existingID) {
        isUnique = true;
      }
    }
    this.transactionId = transactionId;
  }
  next();
});

export default mongoose.model("Transaction", transactionSchema);
