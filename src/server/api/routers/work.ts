import { z } from "zod"

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc"

export const workRouter = createTRPCRouter({
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        slug: z.string().min(1),
        featureImage: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.work.create({
        data: {
          userId: ctx.session.user.id,
          ...input,
        },
      })
    }),
})
