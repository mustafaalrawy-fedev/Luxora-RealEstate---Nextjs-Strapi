import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      jwt: string;
      user_type: "Buyer" | "Agent";
    } & DefaultSession["user"];
  }

  interface User {
    jwt: string;
    user_type: "Buyer" | "Agent";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    jwt: string;
    user_type: "Buyer" | "Agent";
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth/local`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: credentials?.identifier,
              password: credentials?.password,
            }),
          });

          const data = await res.json();

          if (res.ok && data.user) {
            // return user data that matches the User type definition
            return {
              id: data.user.id.toString(),
              name: data.user.username,
              email: data.user.email,
              jwt: data.jwt,
              user_type: data.user.user_type, // null if not set yet or for new users
            };
          }
          return null;
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }
      },
    }),
  ],
  // Callbacks
callbacks: {
  async jwt({ token, user, trigger, session }) {
    // 1. Initial Sign In
    if (user) {
      token.id = user.id;
      token.jwt = user.jwt;
      token.user_type = user.user_type;
    }

    // 2. Handle the 'update' call from the frontend
    if (trigger === "update" && session) {
      token.user_type = session.user.user_type;
    }

    return token;
  },
  async session({ session, token }) {
    if (token && session.user) {
      session.user.id = token.id as string;
      session.user.jwt = token.jwt as string;
      session.user.user_type = token.user_type as "Buyer" | "Agent";
    }
    return session;
  },
},
  // Pages: used to redirect to the login page if the user is not authenticated
  pages: {
    signIn: "/login",
  },
  // Session: used to store the session in the browser
  session: {
    strategy: "jwt", // استخدام JWT بدلاً من Database sessions
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };