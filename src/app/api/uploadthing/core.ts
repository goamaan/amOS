import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { getServerAuthSession } from "~/server/auth"

const f = createUploadthing()

export const imageFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({}) => {
      const session = await getServerAuthSession()
      if (!session) throw new UploadThingError("Unauthorized")

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId }
    }),
} satisfies FileRouter

export type ImageFileRouter = typeof imageFileRouter
