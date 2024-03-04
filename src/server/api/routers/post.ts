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
        // description: z.string().min(1).default(""),
        // slug: z.string().min(1).default(""),
        // featureImage: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input: { title } }) => {
      return ctx.db.post.create({
        data: {
          title,
          description: "",
          slug: kebabCase(title),
          userId: ctx.session.user.id,
        },
      })
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.post.findMany({})
  }),
  get: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input: { slug } }) => {
      return ctx.db.post.findUnique({ where: { slug } })
    }),
})
