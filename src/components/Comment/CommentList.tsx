"use client"

import { MessageCircle } from "lucide-react"
import { type Session } from "next-auth"
import { Comment } from "~/components/Comment/Comment"
import { SignInDialog } from "~/components/SignInDialog"
import { Button } from "~/components/ui/button"
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
  const { data, isLoading, isError, error } =
    api.comment.getAllForType.useQuery(
      { id, type },
      {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    )
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    )
  }

  if (isError || !data) return <p>Error loading comments... {error?.message}</p>

  return (
    <div className="my-4 flex w-full flex-col gap-2 space-y-4">
      <div className="flex w-full items-center justify-center gap-2">
        <div className="h-0.5 max-w-40 flex-1 border-t-2 border-dashed"></div>
        <MessageCircle className="self-center" />
        <div className="h-0.5 max-w-40 flex-1 border-t-2 border-dashed"></div>
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col space-y-3 px-4 py-4 md:px-8">
        <div className="flex flex-col gap-2 space-y-3">
          {data.length > 0 &&
            data.map((comment) => (
              <Comment key={comment.id} comment={comment} user={user} />
            ))}
          {!user && (
            <SignInDialog
              trigger={
                <Button
                  size="sm"
                  variant="outline"
                  className="w-fit self-center"
                >
                  Sign in to comment
                </Button>
              }
            />
          )}
          {data.length === 0 && (
            <p className="text-quaternary block text-center">
              No comments yet...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
