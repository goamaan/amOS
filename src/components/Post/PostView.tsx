import { type Post } from "@prisma/client"
import { Editor } from "~/components/editor/editor"

export function PostView({ post }: { post: Post }) {
  return (
    <div className="flex max-h-screen flex-col space-y-4">
      <h1 className="text-2xl font-semibold">{post.title}</h1>
      <Editor content={post.content} />
    </div>
  )
}
