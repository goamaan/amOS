import { TRPCError } from "@trpc/server"
import { z } from "zod"

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"

export const questionRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input: { id } }) => {
      const question = await ctx.db.question.findUnique({
        where: { id },
        include: { author: true, comments: true, reactions: true },
      })
      if (!question) {
        throw new TRPCError({ code: "NOT_FOUND", cause: "Question not found" })
      }
      return question
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.question.findMany({
      include: { author: { select: { name: true, id: true, image: true } } },
    })
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input: { title, description } }) => {
      try {
        return ctx.db.question.create({
          data: {
            title,
            description,
            userId: ctx.session.user.id,
          },
        })
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: "Something went wrong",
        })
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input: { id, description, title } }) => {
      const question = await ctx.db.question.findUnique({
        where: { id },
      })
      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          cause: "Question not found",
        })
      }
      if (question.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          cause: "You are not the author of this question",
        })
      }
      return ctx.db.question.update({
        where: {
          id,
        },
        data: {
          title,
          description,
        },
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      const question = await ctx.db.question.findUnique({
        where: { id },
      })
      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          cause: "Question not found",
        })
      }
      if (
        question.userId !== ctx.session.user.id &&
        !ctx.session.user.isAdmin
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          cause: "You are not the author of this question",
        })
      }
      return ctx.db.question.delete({ where: { id } })
    }),
})
