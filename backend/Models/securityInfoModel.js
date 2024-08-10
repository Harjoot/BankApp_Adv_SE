import mongoose from "mongoose";
import bcrypt from 'bcryptjs';


const securitySchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  twoFactorAuthEnabled: { type: Boolean, default: false }
});

securitySchema.methods.checkPassword = async function(password) {
  const result = await bcrypt.compare(password, this.password);
  console.log('Password match result:', result);
  return result;
};

securitySchema.pre('save', async function(next) {
  
  if (this.isModified('password') || this.isNew) {
    if(this.password!=this.confirmPassword ){
      const error = new Error('Password and ConfirmPassword are not same');
      return next(error);
    }
    this.password = await bcrypt.hash(this.password, 10);

    //clear confirm password field
    this.confirmPassword = undefined;
  }
  next();
});

export default mongoose.model("Security", securitySchema);
