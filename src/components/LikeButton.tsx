"use client"

import { Heart } from "lucide-react"
import { type Session } from "next-auth"
import { useCallback } from "react"
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
  const { data, isFetching, isError, error } =
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

  const { mutateAsync, isLoading } = api.reaction.toggleReaction.useMutation({
    //     onMutate: async ({ id, type }) => {
    //       if (!user) return
    // await client({ queryKey: ['todos', newTodo.id] })
    //       data?.push({
    //         userId: user.id,
    //         postId: id,
    //         bookmarkId: null,
    //         stackId: null,
    //         questionId: null,
    //         createdAt: new Date(),
    //         id: "",
    //         user: { id: user.id },
    //       })
    //     },
  })

  const toggleLike = async () => {
    if (!user) return
    await mutateAsync({
      id,
      type,
    })
  }

  const liked = data?.some((like) => like.userId === user?.id)

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
