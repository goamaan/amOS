import { commentRouter } from "~/server/api/routers/comment"
import { postRouter } from "~/server/api/routers/post"
import { reactionRouter } from "~/server/api/routers/reaction"
import { userRouter } from "~/server/api/routers/user"
import { createTRPCRouter } from "~/server/api/trpc"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  comment: commentRouter,
  user: userRouter,
  reaction: reactionRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
