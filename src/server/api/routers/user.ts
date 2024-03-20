import { TRPCError } from "@trpc/server"
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
  get: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input: { id } }) => {
      const user = await ctx.db.user.findUnique({ where: { id } })
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", cause: "User not found" })
      }
      return user
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      const user = await ctx.db.user.delete({ where: { id } })
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", cause: "User not found" })
      }
      if (user.id !== ctx.session.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED", cause: "Unauthorized" })
      }

      await ctx.db.user.delete({ where: { id } })
    }),
})
