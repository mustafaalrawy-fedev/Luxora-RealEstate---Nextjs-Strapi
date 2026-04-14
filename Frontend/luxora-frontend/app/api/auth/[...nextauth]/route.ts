import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
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
            // نرجع كائن يتوافق مع تعريف الـ User الذي وضعناه في الخطوة الأولى
            return {
              id: data.user.id.toString(),
              name: data.user.username,
              email: data.user.email,
              jwt: data.jwt,
              user_type: data.user.user_type,
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
    // JWT Callback
    async jwt({ token, user }) {
      // إذا كان هناك مستخدم (حدث تسجيل دخول للتو)، انقل البيانات للـ token
      if (user) {
        token.jwt = user.jwt;
        token.user_type = user.user_type;
      }
      return token;
    },
    // Session Callback
    async session({ session, token }) {
      // انقل البيانات من الـ token إلى الـ session لتظهر في الـ Frontend
      if (session.user) {
        session.user.jwt = token.jwt;
        session.user.user_type = token.user_type;
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