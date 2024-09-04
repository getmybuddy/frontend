import { userLogin } from "@/services/auth";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await userLogin({
          identifier: credentials?.email as string,
          password: credentials?.password as string,
        });
        const cookieString = user.headers["set-cookie"]?.[0];
        const authenticationCookie = cookieString
          ?.split(";")
          .find((cookie) => cookie.trim().startsWith("Authentication="))
          ?.split("=")[1];
        cookies().set({
          name: "Authentication",
          value: authenticationCookie as string,
          secure: false,
          httpOnly: false,
          expires: Date.now() + 60 * 60 * 1000,
        });

        if (user.data.message === "User logged in successfully") {
          return {
            id: user.data.data.tokenPayload.userId,
            email: credentials?.email,
            expires: Date.now() + 60 * 60 * 1000,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    maxAge: 1 * 60 * 60,
    updateAge: 1 * 60 * 60,
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (account && user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.expires = user.expires;
      }
      if (Date.now() > token.expires) {
        return null;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      session.expires = new Date(token.expires);
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/chat")) {
        return `${baseUrl}`;
      } else {
        return baseUrl + "/chat";
      }
    },
    async signIn(user) {
      if (user) {
        return true;
      } else {
        return "/auth/login?error=true";
      }
    },
  },
  events: {
    signOut() {
      cookies().delete("Authentication");
    },
  },
};

export default authOptions;
