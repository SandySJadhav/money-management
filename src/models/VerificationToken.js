import mongoose from 'mongoose';

const verificationTokenSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  token: { type: String, unique: true, required: true },
  expires: { type: Date, required: true },
});

const VerificationToken = mongoose.models.VerificationToken || mongoose.model('VerificationToken', verificationTokenSchema);

export default VerificationToken;
