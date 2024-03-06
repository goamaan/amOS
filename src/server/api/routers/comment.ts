import { TRPCError } from "@trpc/server"
import { z } from "zod"

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"

export const commentRouter = createTRPCRouter({
  getAllForType: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        type: z.enum(["post", "bookmark", "stack", "work", "question"]),
      }),
    )
    .query(async ({ ctx, input: { id, type } }) => {
      switch (type) {
        case "post":
          return ctx.db.comment.findMany({
            where: {
              postId: id,
            },
            select: {
              id: true,
              text: true,
              updatedAt: true,
              author: {
                select: {
                  name: true,
                  id: true,
                  image: true,
                },
              },
            },
          })
        case "bookmark":
          return ctx.db.comment.findMany({
            where: {
              bookmarkId: id,
            },
            select: {
              id: true,
              text: true,
              updatedAt: true,
              author: {
                select: {
                  name: true,
                  id: true,
                  image: true,
                },
              },
            },
          })
        case "stack":
          return ctx.db.comment.findMany({
            where: {
              stackId: id,
            },
            select: {
              id: true,
              text: true,
              updatedAt: true,
              author: {
                select: {
                  name: true,
                  id: true,
                  image: true,
                },
              },
            },
          })
        case "work":
          return ctx.db.comment.findMany({
            where: {
              workId: id,
            },
            select: {
              id: true,
              text: true,
              updatedAt: true,
              author: {
                select: {
                  name: true,
                  id: true,
                  image: true,
                },
              },
            },
          })
        case "question":
          return ctx.db.comment.findMany({
            where: {
              questionId: id,
            },
            select: {
              id: true,
              text: true,
              updatedAt: true,
              author: {
                select: {
                  name: true,
                  id: true,
                  image: true,
                },
              },
            },
          })
        default:
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: "Type not found",
          })
      }
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), text: z.string() }))
    .mutation(async ({ ctx, input: { id, text } }) => {
      const comment = await ctx.db.comment.findUnique({ where: { id } })
      if (!comment) {
        throw new TRPCError({ code: "NOT_FOUND", cause: "Comment not found" })
      }

      if (comment.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          cause: "You are not the author of this comment",
        })
      }

      return ctx.db.comment.update({ where: { id }, data: { text } })
    }),
  add: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        text: z.string(),
        type: z.enum(["post", "bookmark", "stack", "work", "question"]),
      }),
    )
    .mutation(async ({ ctx, input: { id, text, type } }) => {
      switch (type) {
        case "post":
          return ctx.db.comment.create({
            data: {
              userId: ctx.session.user.id,
              text,
              postId: id,
            },
          })
        case "bookmark":
          return ctx.db.comment.create({
            data: {
              userId: ctx.session.user.id,
              text,
              bookmarkId: id,
            },
          })
        case "stack":
          return ctx.db.comment.create({
            data: {
              userId: ctx.session.user.id,
              text,
              stackId: id,
            },
          })
        case "work":
          return ctx.db.comment.create({
            data: {
              userId: ctx.session.user.id,
              text,
              workId: id,
            },
          })
        case "question":
          return ctx.db.comment.create({
            data: {
              userId: ctx.session.user.id,
              text,
              questionId: id,
            },
          })
        default:
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: "Type not found",
          })
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      const comment = await ctx.db.comment.findUnique({ where: { id } })
      if (!comment) {
        throw new TRPCError({ code: "NOT_FOUND", cause: "Comment not found" })
      }
      if (comment.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          cause: "You are not the author of this comment",
        })
      }
      return ctx.db.comment.delete({ where: { id } })
    }),
})
