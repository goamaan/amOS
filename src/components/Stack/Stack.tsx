"use client"

import { Edit, Link as LinkIcon } from "lucide-react"
import { type Session } from "next-auth"
import Link from "next/link"
import { AddComment } from "~/components/Comment/AddComment"
import { CommentList } from "~/components/Comment/CommentList"
import { LikeButton } from "~/components/LikeButton"
import { AddUserToStack } from "~/components/Stack/AddUserToStack"
import { DeleteStack } from "~/components/Stack/DeleteStack"
import { EditStackForm } from "~/components/Stack/EditStack"
import { TitleBar } from "~/components/TitleBar"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Spinner } from "~/components/ui/spinner"
import { api } from "~/trpc/react"

export function StackDetail({
  slug,
  user,
}: {
  slug: string
  user?: Session["user"]
}) {
  const { data: stack, isLoading, isError } = api.stack.get.useQuery({ slug })

  if (isLoading) {
    return (
      <div className="relative flex max-h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (isError || !stack) {
    return <p>Error loading stack item...</p>
  }

  return (
    <div className="relative flex max-h-screen w-full flex-col space-y-4 overflow-y-auto">
      <TitleBar
        hasBgColor={false}
        title={stack.name}
        trailingAccessory={
          <LikeButton id={stack.id} user={user} type="stack" />
        }
      />
      <div className="m-20 flex flex-col space-y-4">
        {user?.isAdmin && (
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" size={"sm"}>
                  <Edit size={12} /> Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit bookmark</DialogTitle>
                </DialogHeader>
                <EditStackForm stack={stack} />
              </DialogContent>
            </Dialog>
            <DeleteStack id={stack.id} />
          </div>
        )}
        <Badge variant={"secondary"} className="w-fit">
          {stack.tag.name}
        </Badge>
        <h1 className="text-4xl font-semibold">{stack.name}</h1>
        <p className="italic text-muted-foreground">{stack.description}</p>
        <Link href={stack.url} target="_blank">
          <Button className="flex w-full items-center gap-2">
            <LinkIcon size={14} /> Visit
          </Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Also used by {stack.users.length} other people
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stack.users.map((u) => (
              <Link
                key={u.id}
                href={`/profile/${u.id}`}
                className="flex items-center space-x-2"
              >
                <Avatar>
                  <AvatarImage src={u.image ?? undefined} />
                  <AvatarFallback>{u.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
            ))}
          </CardContent>
          <CardFooter>
            <AddUserToStack
              stackUsers={stack.users.map((u) => u.id)}
              id={stack.id}
              user={user}
            />
          </CardFooter>
        </Card>
        <div className="pt-8">
          <CommentList id={stack.id} type="stack" user={user} />
          {user && <AddComment id={stack.id} type="stack" />}
        </div>
      </div>
    </div>
  )
}
