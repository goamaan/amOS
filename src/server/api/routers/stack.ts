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

export const stackRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input: { slug } }) => {
      const stack = await ctx.db.stack.findUnique({
        where: { slug },
        include: { tag: true, comments: true, reactions: true, users: true },
      })
      if (!stack) {
        throw new TRPCError({ code: "NOT_FOUND", cause: "Stack not found" })
      }
      return stack
    }),

  getTags: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.stackTag.findMany()
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.stack.findMany({ include: { tag: true } })
  }),

  createTag: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input: { name } }) => {
      try {
        return ctx.db.stackTag.create({
          data: {
            name,
          },
        })
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Tag already exists",
            })
          }
        }
      }
    }),

  deleteTag: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        return ctx.db.stackTag.delete({ where: { id } })
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Tag not found",
            })
          }
        }
      }
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        url: z.string().url("Must be a valid URL"),
        tagId: z.string().min(1),
        image: z.string().url("Must be a valid URL"),
      }),
    )
    .mutation(
      async ({ ctx, input: { name, description, url, tagId, image } }) => {
        try {
          return ctx.db.stack.create({
            data: {
              name,
              description,
              image,
              url,
              tagId,
              slug: kebabCase(name),
            },
          })
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
              throw new TRPCError({
                code: "CONFLICT",
                message: "Stack item with the same slug already exists",
              })
            }
          }
        }
      },
    ),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        description: z.string().min(1),
        url: z.string().url("Must be a valid URL"),
        tagId: z.string().min(1),
        image: z.string().url("Must be a valid URL"),
      }),
    )
    .mutation(
      async ({ ctx, input: { id, name, description, url, tagId, image } }) => {
        return ctx.db.stack.update({
          where: {
            id,
          },
          data: {
            name,
            description,
            url,
            image,
            tagId,
          },
        })
      },
    ),

  delete: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        return ctx.db.stack.delete({ where: { id } })
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              cause: "Stack not found",
            })
          }
        }
      }
    }),

  toggleUser: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      const userId = ctx.session.user.id
      const stack = await ctx.db.stack.findUnique({
        where: { id },
        include: { users: true },
      })

      if (!stack) {
        throw new TRPCError({ code: "NOT_FOUND", cause: "Stack not found" })
      }

      if (stack.users.some((user) => user.id === userId)) {
        await ctx.db.stack.update({
          where: { id },
          data: {
            users: {
              disconnect: { id: userId },
            },
          },
        })
        return { status: "removed" }
      }

      await ctx.db.stack.update({
        where: { id },
        data: {
          users: {
            connect: { id: userId },
          },
        },
      })

      return { status: "added" }
    }),
})
