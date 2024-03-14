import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"

export const userRouter = createTRPCRouter({
  hasLikedEntry: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["post", "stack", "question", "bookmark"]),
      }),
    )
    .query(async ({ ctx, input: { id, type } }) => {
      let like
      switch (type) {
        case "post":
          like = await ctx.db.reaction.findFirst({
            where: { userId: ctx.session.user.id, postId: id },
          })
        case "stack":
          like = await ctx.db.reaction.findFirst({
            where: { userId: ctx.session.user.id, stackId: id },
          })
        case "question":
          like = await ctx.db.reaction.findFirst({
            where: { userId: ctx.session.user.id, questionId: id },
          })
        default:
          like = await ctx.db.reaction.findFirst({
            where: { userId: ctx.session.user.id, bookmarkId: id },
          })
      }
      return !!like
    }),
})
