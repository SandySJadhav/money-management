import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";
import User from "@/lib/Schemas/user";
import connectDB from "@/lib/db";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userName: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ userName: credentials.userName }).select('+password');
        if (!user) {
          throw new Error('404');
        } else {
          const isPasswordValid = await user.comparePassword(credentials.password);
          if (!isPasswordValid) {
            throw new Error('401');
          }
        }
        return { id: user._id, userName: user.userName, firstName: user.firstName, lastName: user.lastName };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userName = user.userName;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.userName = token.userName;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
    encode: async ({ secret, token }) => {
      const jwtClaims = {
        sub: token.id,
        name: token.userName,
        iat: Date.now() / 1000,
        exp: Math.floor(Date.now() / 1000) + 60 * 60
      };
      return jwt.sign(jwtClaims, secret, { algorithm: "HS256" });
    },
    decode: async ({ secret, token }) => {
      return jwt.verify(token, secret, { algorithms: ["HS256"] });
    }
  }
});

export { handler as GET, handler as POST };