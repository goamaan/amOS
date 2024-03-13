import { z } from "zod"

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"

export const reactionRouter = createTRPCRouter({
  getReactionsForEntry: publicProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["post", "stack", "question", "bookmark"]),
      }),
    )
    .query(async ({ ctx, input: { id, type } }) => {
      return ctx.db.reaction.findMany({
        where: { [`${type}Id`]: id },
      })
    }),
  toggleReaction: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["post", "stack", "question", "bookmark"]),
      }),
    )
    .mutation(async ({ ctx, input: { id, type } }) => {
      const hasLiked = await ctx.db.reaction.findFirst({
        where: { userId: ctx.session.user.id, [`${type}Id`]: id },
      })
      if (hasLiked) {
        return ctx.db.reaction.delete({
          where: {
            id: hasLiked.id,
          },
        })
      }
      return ctx.db.reaction.create({
        data: {
          userId: ctx.session.user.id,
          [`${type}Id`]: id,
        },
      })
    }),
})
