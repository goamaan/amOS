import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { kebabCase } from "~/lib/utils"

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc"

export const bookmarkRouter = createTRPCRouter({
  createTag: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input: { name } }) => {
      try {
        return ctx.db.bookmarkTag.create({
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

  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        host: z.string().min(1),
        url: z.string().url("Must be a valid URL"),
        tagId: z.string().min(1),
        faviconUrl: z.string().url("Must be a valid URL").optional(),
      }),
    )
    .mutation(
      async ({ ctx, input: { title, description, host, url, tagId } }) => {
        try {
          return ctx.db.bookmark.create({
            data: {
              title,
              description,
              url,
              host,
              tagId,
            },
          })
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
              throw new TRPCError({
                code: "CONFLICT",
                message: "Bookmark with the same URL already exists",
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
        title: z.string().min(1),
        url: z.string().url(),
        host: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input: { id, description, host, title, url } }) => {
      return ctx.db.bookmark.update({
        where: {
          id,
        },
        data: {
          title,
          description,
          host,
          url,
        },
      })
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.bookmark.findMany()
  }),

  get: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input: { id } }) => {
      const bookmark = await ctx.db.bookmark.findUnique({ where: { id } })
      if (!bookmark) {
        throw new TRPCError({ code: "NOT_FOUND", cause: "Bookmark not found" })
      }
      return bookmark
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        return ctx.db.bookmark.delete({ where: { id } })
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              cause: "Bookmark not found",
            })
          }
        }
      }
    }),
})
