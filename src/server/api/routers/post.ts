import { z } from "zod"

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc"

export const postRouter = createTRPCRouter({
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        slug: z.string().min(1),
        featureImage: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          userId: ctx.session.user.id,
          ...input,
        },
      })
    }),
})
