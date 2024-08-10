import mongoose from "mongoose";

const accountDetailsSchema = new mongoose.Schema({
  accountCategory: {
    type: String,
    enum: ["Personal", "Business"],
    required: true,
  },
  accountType: {
    type: String,
    enum: ["Checking", "Savings"],
    required: true,
  }
});

export default mongoose.model("AccountDetails", accountDetailsSchema);
