import { bookmarkRouter } from "~/server/api/routers/bookmark"
import { commentRouter } from "~/server/api/routers/comment"
import { musicRouter } from "~/server/api/routers/music"
import { postRouter } from "~/server/api/routers/post"
import { questionRouter } from "~/server/api/routers/question"
import { reactionRouter } from "~/server/api/routers/reaction"
import { stackRouter } from "~/server/api/routers/stack"
import { userRouter } from "~/server/api/routers/user"
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc"

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
  stack: stackRouter,
  music: musicRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
