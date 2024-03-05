import { TRPCError } from "@trpc/server"
import { revalidatePath } from "next/cache"
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
      }),
    )
    .mutation(async ({ ctx, input: { title } }) => {
      const post = await ctx.db.post.create({
        data: {
          title,
          description: "",
          slug: kebabCase(title),
          userId: ctx.session.user.id,
        },
      })

      revalidatePath("/writing", "layout")

      return post
    }),

  updateDescription: adminProcedure
    .input(z.object({ id: z.string().min(1), description: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id, description } }) => {
      const post = await ctx.db.post.update({
        where: {
          id,
        },
        data: {
          description,
        },
      })

      revalidatePath(`/writing/${post.slug}`, "page")

      return post
    }),

  updateTitle: adminProcedure
    .input(z.object({ id: z.string().min(1), title: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id, title } }) => {
      const post = await ctx.db.post.update({
        where: {
          id,
        },
        data: {
          title,
        },
      })
      return post
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.post.findMany({})
  }),

  get: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input: { slug } }) => {
      const post = await ctx.db.post.findUnique({ where: { slug } })
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", cause: "Post not found" })
      }
      return post
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
