import { bookmarkRouter } from "~/server/api/routers/bookmark"
import { commentRouter } from "~/server/api/routers/comment"
import { postRouter } from "~/server/api/routers/post"
import { questionRouter } from "~/server/api/routers/question"
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
  bookmark: bookmarkRouter,
  question: questionRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
