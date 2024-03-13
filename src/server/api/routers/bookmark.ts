import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc"

export const bookmarkRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input: { id } }) => {
      const bookmark = await ctx.db.bookmark.findUnique({
        where: { id },
        include: { tag: true, comments: true, reactions: true },
      })
      if (!bookmark) {
        throw new TRPCError({ code: "NOT_FOUND", cause: "Bookmark not found" })
      }
      return bookmark
    }),

  getTags: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.bookmarkTag.findMany()
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.bookmark.findMany()
  }),

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

  deleteTag: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        return ctx.db.bookmarkTag.delete({ where: { id } })
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
        title: z.string().min(1),
        description: z.string().min(1),
        host: z.string().min(1),
        url: z.string().url("Must be a valid URL"),
        tagId: z.string().min(1),
        faviconUrl: z.string().url("Must be a valid URL").optional(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { title, description, host, url, tagId, faviconUrl },
      }) => {
        try {
          return ctx.db.bookmark.create({
            data: {
              title,
              description,
              faviconUrl,
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
        faviconUrl: z.string().url().optional(),
        tagId: z.string().min(1),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { id, description, host, title, url, faviconUrl, tagId },
      }) => {
        return ctx.db.bookmark.update({
          where: {
            id,
          },
          data: {
            title,
            description,
            host,
            url,
            faviconUrl,
            tagId,
          },
        })
      },
    ),

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
