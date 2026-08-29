import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isAllowedEmail } from "@/lib/access";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Repo is public and this app rides Jacob's own Claude Max OAuth quota — only the two
    // known family accounts may sign in at all, everyone else gets NextAuth's default
    // AccessDenied error page.
    async signIn({ user }) {
      return isAllowedEmail(user.email);
    },
  },
});
