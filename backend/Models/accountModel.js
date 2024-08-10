// Account Model
import mongoose from 'mongoose';
import crypto from 'crypto';

const accountSchema = new mongoose.Schema({
  accountNumber: { type: String, unique: true },
  balance: { type: Number, default: 0 },
  personalInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'PersonalInfo' },
  accountDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'AccountDetails' },
  legalCompliance: { type: mongoose.Schema.Types.ObjectId, ref: 'LegalCompliance' },
  securityInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'Security' },
  systemFields: { type: mongoose.Schema.Types.ObjectId, ref: 'SystemFields' },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
},{timestamps: true});

function generateAccountNumber() {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
}

// Pre-save hook to set the account number if it doesn't exist
accountSchema.pre('save', async function(next) {
  if (!this.accountNumber) {
    let accountNumber;
    let isUnique = false;
    
    // Keep generating until we find a unique account number
    while (!isUnique) {
      accountNumber = generateAccountNumber();
      // Check if this account number already exists
      const existingAccount = await this.constructor.findOne({ accountNumber });
      if (!existingAccount) {
        isUnique = true;
      }
    }
    
    this.accountNumber = accountNumber;
  }
  next();
});

export default mongoose.model('Account', accountSchema);
