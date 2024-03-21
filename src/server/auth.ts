import { PrismaAdapter } from "@auth/prisma-adapter"
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth"
import { type Adapter } from "next-auth/adapters"
import TwitterProvider, {
  type TwitterProfile,
} from "next-auth/providers/twitter"

import { env } from "~/env"
import { db } from "~/server/db"

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      isAdmin: boolean
      username: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"]
  }

  interface User {
    username: string
    // ...other properties
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: (data) => {
      const { user, session } = data
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          username: user.username,
          isAdmin: user.username === env.ADMIN_USERNAME,
        },
      }
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      version: "2.0",
      profile: ({ data }: TwitterProfile) => {
        return {
          id: data.id,
          name: data.name,
          // NOTE: E-mail is currently unsupported by OAuth 2 Twitter.
          email: null,
          image: data.profile_image_url,
          username: data.username,
        }
      },
    }),
  ],
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
