"use client"

import { MessageCircle } from "lucide-react"
import { type Session } from "next-auth"
import { Comment } from "~/components/Comment/Comment"
import { Spinner } from "~/components/ui/spinner"
import { api } from "~/trpc/react"

export function CommentList({
  id,
  type,
  user,
}: {
  id: string
  type: "post" | "bookmark" | "stack" | "work" | "question"
  user?: Session["user"]
}) {
  const { data, isFetching, isError, error } =
    api.comment.getAllForType.useQuery(
      { id, type },
      {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    )
  if (isFetching) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    )
  }

  if (isError || !data) return <p>Error loading comments... {error?.message}</p>

  return (
    <div className="mt-10 flex flex-col gap-2 pb-10">
      <MessageCircle />

      {data.length > 0 &&
        data.map((comment) => (
          <Comment key={comment.id} comment={comment} user={user} />
        ))}
      {data.length === 0 && (
        <p className="text-quaternary block text-center">No comments yet...</p>
      )}
    </div>
  )
}
