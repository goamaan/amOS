"use client"

import { type Post } from "@prisma/client"
import { type Session } from "next-auth"
import { useRouter } from "next/navigation"
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
  const router = useRouter()

  const onContentChange = async (content: string) => {
    setContent(content)
    await mutateAsync({ id: post.id, description: content })
    router.refresh()
  }

  return (
    <div className="relative flex w-full flex-col">
      <Editor
        editable={user?.isAdmin}
        content={content}
        onContentChange={onContentChange}
      />
    </div>
  )
}
