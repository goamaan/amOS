"use client"

import { Heart } from "lucide-react"
import { type Session } from "next-auth"
import { toast } from "sonner"
import { SignInDialog } from "~/components/SignInDialog"
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
  const { data, isLoading, isError, error } =
    api.reaction.getReactionsForEntry.useQuery(
      {
        id,
        type,
      },
      {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    )

  const { mutateAsync } = api.reaction.toggleReaction.useMutation({})

  const toggleLike = async () => {
    if (!user) return
    await mutateAsync(
      {
        id,
        type,
      },
      {
        onError(error) {
          toast.error(error.message)
        },
      },
    )
  }

  const liked = data?.some((like) => like.userId === user?.id)

  if (isLoading) {
    return (
      <Button variant={"outline"} size={"icon"}>
        <Spinner size={"sm"} />
      </Button>
    )
  }

  if (isError || !data) {
    console.error("error fetching user like", error?.message)
    return (
      <Button variant={"outline"} className="flex gap-2.5 px-4 py-2">
        <Heart size={14} />
      </Button>
    )
  }

  if (!user) {
    return (
      <SignInDialog
        trigger={
          <Button variant={"outline"} className="flex gap-2.5 px-4 py-2">
            <Heart size={14} />
            {data.length}
          </Button>
        }
      />
    )
  }

  return (
    <Button
      onClick={toggleLike}
      variant={"outline"}
      className="flex gap-2.5 px-4 py-2"
    >
      <Heart size={14} fill={liked ? "red" : "none"} />
      {data.length}
    </Button>
  )
}
