import User from '@/models/User';
import Account from '@/models/Account';
import Session from '@/models/Session';
import VerificationToken from '@/models/VerificationToken';

export const MongooseAdapter = (options = {}) => {
  return {
    async createUser(profile) {
      const user = await User.create({
        email: profile.email,
        username: profile.name || profile.email,
        firstName: '', // Default empty
        lastName: '', // Default empty
        birthYear: 2000, // Default value
        password: '', // Password will be set on first login/registration
      });
      return user;
    },
    async getUser(id) {
      const user = await User.findById(id);
      return user;
    },
    async getUserByEmail(email) {
      const user = await User.findOne({ email });
      return user;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await Account.findOne({ provider, providerAccountId });
      if (!account) return null;
      const user = await User.findById(account.userId);
      return user;
    },
    async updateUser(user) {
      const updatedUser = await User.findByIdAndUpdate(user.id, user, { new: true });
      return updatedUser;
    },
    async deleteUser(userId) {
      await Promise.all([
        Account.deleteMany({ userId }),
        Session.deleteMany({ userId }),
        User.findByIdAndDelete(userId),
      ]);
    },
    async linkAccount(account) {
      const newAccount = await Account.create(account);
      return newAccount;
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await Account.deleteOne({ providerAccountId, provider });
    },
    async getSessionAndUser(sessionToken) {
      const session = await Session.findOne({ sessionToken });
      if (!session) return null;
      const user = await User.findById(session.userId);
      if (!user) return null;
      return { session, user };
    },
    async createSession(session) {
      const newSession = await Session.create(session);
      return newSession;
    },
    async updateSession(session) {
      const updatedSession = await Session.findOneAndUpdate({ sessionToken: session.sessionToken }, session, { new: true });
      return updatedSession;
    },
    async deleteSession(sessionToken) {
      await Session.deleteOne({ sessionToken });
    },
    async createVerificationToken(token) {
      const newVerificationToken = await VerificationToken.create(token);
      return newVerificationToken;
    },
    async useVerificationToken({ identifier, token }) {
      const verificationToken = await VerificationToken.findOneAndDelete({ identifier, token });
      return verificationToken;
    },
  };
};
