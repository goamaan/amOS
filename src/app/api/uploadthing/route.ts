import { createRouteHandler } from "uploadthing/next"
import { imageFileRouter } from "~/app/api/uploadthing/core"

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: imageFileRouter,
})
