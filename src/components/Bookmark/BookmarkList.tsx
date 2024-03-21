import { type BookmarkTag, type Bookmark } from "@prisma/client"
import { ExternalLink, Plus, Tag } from "lucide-react"
import { type Session } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { AddBookmarkForm } from "~/components/Bookmark/AddBookmark"
import { BookmarkTags } from "~/components/Bookmark/BookmarkTags"
import { ListContainer } from "~/components/ListContainer"
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

function AddBookmarkDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add new Bookmark</DialogTitle>
        </DialogHeader>
        <AddBookmarkForm />
      </DialogContent>
    </Dialog>
  )
}

function AddBookmarkTagDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Tag size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bookmark Tags</DialogTitle>
        </DialogHeader>
        <BookmarkTags />
      </DialogContent>
    </Dialog>
  )
}

export async function BookmarksList({
  params,
  user,
  bookmarks,
}: {
  params: { id: string }
  user?: Session["user"]
  bookmarks: (Bookmark & { tag: BookmarkTag })[]
}) {
  return (
    <ListContainer>
      <TitleBar
        hasBgColor
        title={"Bookmarks"}
        trailingAccessory={
          user?.isAdmin ? (
            <div className="flex gap-1">
              <AddBookmarkTagDialog />
              <AddBookmarkDialog />
            </div>
          ) : null
        }
      />
      <div className="flex flex-col items-start gap-2 p-2 text-start">
        {bookmarks.map((p) => {
          const active = params.id === p.id
          return (
            <Link key={p.id} href={`/bookmarks/${p.id}`} className="w-full">
              <Button
                variant={active ? "secondary" : "ghost"}
                className="flex w-full flex-col items-start py-7"
              >
                <div className="flex w-full items-center justify-between">
                  <p className="">{p.title}</p>
                  <Badge className="flex items-center gap-1 text-xs">
                    <Tag size={12} /> {p.tag.name}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {p.faviconUrl ? (
                    <Image
                      width={16}
                      height={16}
                      alt="favicon"
                      src={p.faviconUrl}
                    />
                  ) : (
                    <ExternalLink size={14} />
                  )}
                  <p className="text-sm text-muted-foreground">{p.url}</p>
                </div>
              </Button>
            </Link>
          )
        })}
      </div>
    </ListContainer>
  )
}
