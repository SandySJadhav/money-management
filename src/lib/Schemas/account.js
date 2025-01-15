import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  accountGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AccountGroup',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String
});

const Account = mongoose.model('Account', accountSchema);

export default Account;