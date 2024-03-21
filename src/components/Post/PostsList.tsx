import { type PostTag, type Post } from "@prisma/client"
import { Plus, Tag } from "lucide-react"
import { type Session } from "next-auth"
import Link from "next/link"
import { ListContainer } from "~/components/ListContainer"
import { TitleBar } from "~/components/TitleBar"
import { AddPostForm } from "~/components/Post/AddPost"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import Image from "next/image"
import { PostTags } from "~/components/Post/PostTags"
import { Badge } from "~/components/ui/badge"

function AddPostDialog({ type }: { type: "writing" | "work" }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new post</DialogTitle>
        </DialogHeader>
        <AddPostForm type={type} />
      </DialogContent>
    </Dialog>
  )
}

function AddPostTagDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Tag size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post Tags</DialogTitle>
        </DialogHeader>
        <PostTags />
      </DialogContent>
    </Dialog>
  )
}
export async function PostsList({
  params,
  user,
  posts,
  type,
}: {
  params: { slug: string }
  user?: Session["user"]
  type: "writing" | "work"
  posts: (Post & { postTag: PostTag })[]
}) {
  return (
    <ListContainer>
      <TitleBar
        hasBgColor
        title={type === "writing" ? "Writing" : "Work"}
        trailingAccessory={
          user?.isAdmin ? (
            <div className="flex gap-1">
              <AddPostTagDialog />
              <AddPostDialog type={type} />{" "}
            </div>
          ) : null
        }
      />
      <div className="flex flex-col items-start gap-2 p-2 text-start">
        {posts.map((p) => {
          const active = params.slug === p.slug
          return (
            <Link key={p.id} href={`/${type}/${p.slug}`} className="w-full">
              <Button
                variant={active ? "secondary" : "ghost"}
                className="flex w-full items-center gap-2 py-8"
              >
                {p.featureImage && (
                  <Image
                    alt="post feature image"
                    className="rounded"
                    src={p.featureImage}
                    width={36}
                    height={36}
                  />
                )}
                <div className="flex w-full flex-col items-start gap-1 py-7">
                  <p className="">
                    {p.title.substring(0, 40) +
                      (p.title.length > 30 ? "..." : "")}
                  </p>
                  <div className="flex w-full items-center justify-between">
                    <p className="justify-start text-sm text-muted-foreground">
                      {p.publishedAt?.toDateString() ??
                        p.updatedAt.toDateString()}
                    </p>
                    <Badge className="flex items-center gap-1 text-xs">
                      <Tag size={12} /> {p.postTag.name}
                    </Badge>
                  </div>
                </div>
              </Button>
            </Link>
          )
        })}
      </div>
    </ListContainer>
  )
}
