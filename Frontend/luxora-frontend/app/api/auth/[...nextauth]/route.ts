import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      jwt: string;
      user_type: "Buyer" | "Agent";
      avatar?: string;
      phone?: string;
      bio?: string;
      socialLinks?: object | Record<string, string> | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    jwt: string;
    user_type: "Buyer" | "Agent";
    avatar?: string;
    phone?: string;
    bio?: string;
    socialLinks?: object | Record<string, string> | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    jwt: string;
    user_type: "Buyer" | "Agent";
    avatar?: string;
    phone?: string;
    bio?: string;
    socialLinks?: object | Record<string, string> | null;
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
          const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/auth/local?populate=*`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: credentials.identifier,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (res.ok && data.user) {
            // Return the user object with all Strapi fields
            return {
              id: data.user.id.toString(),
              name: data.user.username,
              email: data.user.email,
              jwt: data.jwt,
              user_type: data.user.user_type,
              avatar: data.user.avatar || "",
              phone: data.user.phone || "",
              bio: data.user.bio || "",
              socialLinks: data.user.socialLinks || {},
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
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Initial Sign In
      if (user) {
        token.id = user.id;
        token.jwt = user.jwt;
        token.user_type = user.user_type;
        token.avatar = user.avatar;
        token.phone = user.phone;
        token.bio = user.bio;
        token.socialLinks = user.socialLinks;
      }

      // 2. Handle the 'update' call from the frontend
      if (trigger === "update" && session?.user) {
        // This spreads the new data from the frontend into the token
        return { ...token, ...session.user };
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.jwt = token.jwt;
        session.user.user_type = token.user_type;
        session.user.avatar = token.avatar;
        session.user.phone = token.phone;
        session.user.bio = token.bio;
        session.user.socialLinks = token.socialLinks;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };