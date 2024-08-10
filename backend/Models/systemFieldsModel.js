import mongoose from "mongoose";

const systemFieldsSchema = new mongoose.Schema({
  
    accountCreationDate: { type: Date, default: Date.now },
    lastLoginDate: Date,
    accountStatus: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
});

export default mongoose.model("SystemFields", systemFieldsSchema);
