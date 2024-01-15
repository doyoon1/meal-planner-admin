import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from '@/lib/mongodb';

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session, token, user }) => {
      const client = await clientPromise;
  
      // Check if the user's email is in the "admins" collection
      const adminEmail = await client.db().collection('admins').findOne({ email: session?.user?.email });
  
      if (adminEmail) {
        return session; // User is in the "admins" collection, allow the session.
      } else {
        return null; // User is not in the "admins" collection, prevent the session.
      }
    },
  },
};

export default NextAuth(authOptions);
