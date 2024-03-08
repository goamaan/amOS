import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { kebabCase } from "~/lib/utils"

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"

export const reactionRouter = createTRPCRouter({
  getReactionsForEntry: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["post", "stack", "question", "bookmark"]),
      }),
    )
    .query(async ({ ctx, input: { id, type } }) => {
      let likes
      switch (type) {
        case "post":
          likes = await ctx.db.reaction.findMany({
            where: { postId: id },
            include: { user: { select: { id: true } } },
          })
        case "stack":
          likes = await ctx.db.reaction.findMany({
            where: { stackId: id },
            include: { user: { select: { id: true } } },
          })
        case "question":
          likes = await ctx.db.reaction.findMany({
            where: { questionId: id },
            include: { user: { select: { id: true } } },
          })
        default:
          likes = await ctx.db.reaction.findMany({
            where: { bookmarkId: id },
            include: { user: { select: { id: true } } },
          })
      }
      return likes
    }),
})
