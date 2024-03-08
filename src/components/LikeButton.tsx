"use client"

import { Heart } from "lucide-react"
import { type Session } from "next-auth"
import { Button } from "~/components/ui/button"
import { Spinner } from "~/components/ui/spinner"
import { api } from "~/trpc/react"

export function LikeButton({
  id,
  user,
  type,
}: {
  id: string
  type: "post" | "stack" | "question" | "bookmark"
  user?: Session["user"]
}) {
  const { data, isFetching, isError, error } =
    api.reaction.getReactionsForEntry.useQuery({
      id,
      type,
    })

  if (isFetching) {
    return (
      <Button variant={"outline"} size={"icon"}>
        <Spinner size={"sm"} />
      </Button>
    )
  }

  if (isError || !data) {
    console.error("error fetching user like", error?.message)
    return (
      <Button>
        <Heart size={14} />
      </Button>
    )
  }

  const liked = data.some((like) => like.userId === user?.id)

  return (
    <Button variant={"outline"} className="flex gap-2.5 px-4 py-2">
      <Heart size={14} fill={liked ? "red" : "none"} />
      {data.length}
    </Button>
  )
}
