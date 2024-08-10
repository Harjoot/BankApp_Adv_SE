import mongoose from "mongoose";

const legalComplianceSchema = new mongoose.Schema({
  citizenshipStatus: String,
  governmentIdType: String,
  governmentIdNumber: String,
  termsAccepted: { type: Boolean, required: true },
  privacyPolicyAgreed: { type: Boolean, required: true }
});

export default mongoose.model("LegalCompliance", legalComplianceSchema);
