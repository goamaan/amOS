import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { kebabCase } from "~/lib/utils"

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc"

export const postRouter = createTRPCRouter({
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        type: z.enum(["work", "writing"]),
        tagId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input: { title, type, tagId } }) => {
      const post = await ctx.db.post.create({
        data: {
          title,
          content: JSON.stringify({}),
          slug: kebabCase(title),
          userId: ctx.session.user.id,
          type,
          postTagId: tagId,
        },
      })

      return post
    }),

  updateContent: adminProcedure
    .input(z.object({ id: z.string().min(1), content: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id, content } }) => {
      const post = await ctx.db.post.update({
        where: {
          id,
        },
        data: {
          content,
        },
      })

      return post
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string().min(2),
        content: z.string(),
        featureImage: z.string().optional(),
        tagId: z.string().min(1),
      }),
    )
    .mutation(
      async ({ ctx, input: { id, title, content, featureImage, tagId } }) => {
        try {
          return ctx.db.post.update({
            where: {
              id,
            },
            data: {
              title,
              content,
              featureImage,
              slug: kebabCase(title),
              postTagId: tagId,
            },
          })
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
          ) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Post not found",
            })
          }
        }
      },
    ),

  getAll: publicProcedure
    .input(z.object({ type: z.enum(["work", "writing"]) }))
    .query(async ({ ctx, input: { type } }) => {
      if (ctx.session?.user.isAdmin) {
        return ctx.db.post.findMany({
          where: { type },
          include: { postTag: true },
        })
      } else {
        return ctx.db.post.findMany({
          where: { type, published: true },
          include: { postTag: true },
        })
      }
    }),

  get: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input: { slug } }) => {
      const post = await ctx.db.post.findUnique({ where: { slug } })
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", cause: "Post not found" })
      }
      if (ctx.session?.user.isAdmin) {
        return post
      } else if (post.published) {
        return post
      }
      throw new TRPCError({ code: "NOT_FOUND", cause: "Post not found" })
    }),

  getTags: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.postTag.findMany()
  }),

  createTag: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input: { name } }) => {
      try {
        return ctx.db.postTag.create({
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
        return ctx.db.postTag.delete({ where: { id } })
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

  delete: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      return ctx.db.post.delete({ where: { id } })
    }),

  publish: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      return ctx.db.post.update({
        where: { id },
        data: { published: true, publishedAt: new Date() },
      })
    }),

  unpublish: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      return ctx.db.post.update({
        where: { id },
        data: { published: false, publishedAt: null },
      })
    }),
})
