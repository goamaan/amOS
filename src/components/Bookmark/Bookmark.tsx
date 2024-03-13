"use client"

import { Edit, ExternalLink, Link as LinkIcon } from "lucide-react"
import { type Session } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { DeleteBookmark } from "~/components/Bookmark/DeleteBookmark"
import { EditBookmarkForm } from "~/components/Bookmark/EditBookmark"
import { AddComment } from "~/components/Comment/AddComment"
import { CommentList } from "~/components/Comment/CommentList"
import { LikeButton } from "~/components/LikeButton"
import { TitleBar } from "~/components/TitleBar"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Spinner } from "~/components/ui/spinner"
import { api } from "~/trpc/react"

export function BookmarkDetail({
  id,
  user,
}: {
  id: string
  user?: Session["user"]
}) {
  const {
    data: bookmark,
    isLoading,
    isError,
  } = api.bookmark.get.useQuery({ id })

  if (isLoading) {
    return (
      <div className="relative flex max-h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (isError || !bookmark) {
    return <p>Error loading bookmark...</p>
  }

  return (
    <div className="relative flex max-h-screen w-full flex-col space-y-4 overflow-y-auto">
      <TitleBar
        hasBgColor={false}
        title={bookmark.title}
        trailingAccessory={
          <LikeButton id={bookmark.id} user={user} type="bookmark" />
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
                  <DialogTitle>Add new Bookmark</DialogTitle>
                </DialogHeader>
                <EditBookmarkForm bookmark={bookmark} />
              </DialogContent>
            </Dialog>
            <DeleteBookmark id={bookmark.id} />
          </div>
        )}
        <Badge variant={"secondary"} className="w-fit">
          {bookmark.tag.name}
        </Badge>
        <h1 className="text-4xl font-semibold">{bookmark.title}</h1>
        <Link href={bookmark.url} target="_blank" className="flex items-center">
          <Button variant={"outline"} className="flex items-center gap-2">
            {bookmark.faviconUrl ? (
              <Image
                width={16}
                height={16}
                alt="favicon"
                src={bookmark.faviconUrl}
              />
            ) : (
              <ExternalLink size={14} />
            )}
            {bookmark.host}
          </Button>
        </Link>
        <p className="italic text-muted-foreground">{bookmark.description}</p>
        <Link href={bookmark.url} target="_blank">
          <Button className="flex w-full items-center gap-2">
            <LinkIcon size={14} /> Visit
          </Button>
        </Link>
        <div className="pt-8">
          <CommentList id={bookmark.id} type="bookmark" user={user} />
          {user && <AddComment id={bookmark.id} type="bookmark" />}
        </div>
      </div>
    </div>
  )
}
