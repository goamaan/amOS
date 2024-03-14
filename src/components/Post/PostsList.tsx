import { type Post } from "@prisma/client"
import { Plus } from "lucide-react"
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

export async function PostsList({
  params,
  user,
  posts,
  type,
}: {
  params: { slug: string }
  user?: Session["user"]
  type: "writing" | "work"
  posts: Post[]
}) {
  return (
    <ListContainer>
      <TitleBar
        hasBgColor
        title={type === "writing" ? "Writing" : "Work"}
        trailingAccessory={user?.isAdmin ? <AddPostDialog type={type} /> : null}
      />
      <div className="flex flex-col items-start gap-2 p-2 text-start">
        {posts.map((p) => {
          const active = params.slug === p.slug
          return (
            <Link key={p.id} href={`/${type}/${p.slug}`} className="w-full">
              <Button
                variant={active ? "secondary" : "ghost"}
                className="flex w-full items-center gap-2 py-7"
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
                <div className="flex w-full flex-col items-start py-7">
                  <p className="">{p.title}</p>
                  <p className="justify-start text-sm text-muted-foreground">
                    {p.publishedAt?.toDateString() ??
                      p.updatedAt.toDateString()}
                  </p>
                </div>
              </Button>
            </Link>
          )
        })}
      </div>
    </ListContainer>
  )
}
