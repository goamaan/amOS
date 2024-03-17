import { z } from "zod"

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"

export const userRouter = createTRPCRouter({
  getIntro: publicProcedure.query(async ({ ctx }) => {
    const intro = await ctx.db.intro.findFirst()
    if (!intro) {
      return ctx.db.intro.create({
        data: {
          content: JSON.stringify({}),
        },
      })
    }

    return intro
  }),
  updateIntro: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { id, content } }) => {
      return ctx.db.intro.updateMany({
        where: {
          id,
        },
        data: {
          content,
        },
      })
    }),
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
