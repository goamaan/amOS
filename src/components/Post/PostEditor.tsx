"use client"

import { type Post } from "@prisma/client"
import { type Session } from "next-auth"
import { useState } from "react"
import { Editor } from "~/components/editor/editor"
import { api } from "~/trpc/react"

export function PostEditor({
  post,
  user,
}: {
  post: Post
  user?: Session["user"]
}) {
  const [content, setContent] = useState(post.description || JSON.stringify({}))
  const { mutateAsync } = api.post.updateDescription.useMutation()

  const onContentChange = (content: string) => {
    setContent(content)
    return mutateAsync({ id: post.id, description: content })
  }

  return (
    <div className="relative flex max-h-screen w-full flex-col overflow-y-auto">
      <Editor
        editable={user?.isAdmin}
        content={content}
        onContentChange={onContentChange}
      />
    </div>
  )
}
