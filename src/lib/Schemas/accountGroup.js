import mongoose from "mongoose";

const accountGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const AccountGroup = mongoose.model('AccountGroup', accountGroupSchema);

export default AccountGroup;