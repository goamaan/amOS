import { type Post, type PostTag } from "@prisma/client"
import { Plus, Tag } from "lucide-react"
import { type Session } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { FilterMenu } from "~/components/FilterMenu"
import { ListContainer } from "~/components/ListContainer"
import { AddPostForm } from "~/components/Post/AddPost"
import { PostTags } from "~/components/Post/PostTags"
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
  filters,
  currentFilter,
}: {
  params: { slug: string }
  currentFilter?: string
  filters: string[]
  user?: Session["user"]
  type: "writing" | "work"
  posts: (Post & { postTag: PostTag })[]
}) {
  const filtered = posts.filter((p) =>
    currentFilter ? p.postTag.name === currentFilter : true,
  )

  return (
    <ListContainer>
      <TitleBar
        hasBgColor
        title={type === "writing" ? "Writing" : "Work"}
        trailingAccessory={
          <div className="flex gap-1">
            <FilterMenu filters={filters} currentFilter={currentFilter} />
            {user?.isAdmin && (
              <>
                <AddPostTagDialog />
                <AddPostDialog type={type} />{" "}
              </>
            )}
          </div>
        }
      />
      <div className="flex flex-col items-start gap-2 p-2 text-start">
        {filtered.length === 0 && (
          <div className="flex self-center">
            <p className="text-sm text-muted-foreground">No results :{"("}</p>
          </div>
        )}
        {filtered.map((p) => {
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
