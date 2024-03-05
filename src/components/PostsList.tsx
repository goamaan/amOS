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

function AddPostDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Plus size={16} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new post</DialogTitle>
        </DialogHeader>
        <AddPostForm />
      </DialogContent>
    </Dialog>
  )
}

export async function PostsList({
  params,
  user,
  posts,
}: {
  params: { slug: string }
  user?: Session["user"]
  posts: Post[]
}) {
  return (
    <ListContainer>
      <TitleBar
        hasBgColor
        title="Writing"
        trailingAccessory={user?.isAdmin ? <AddPostDialog /> : null}
      />
      <div className="flex flex-col items-start gap-2 p-2 text-start">
        {posts.map((p) => {
          const active = params.slug === p.slug
          return (
            <Link key={p.id} href={`/writing/${p.slug}`} className="w-full">
              <Button
                variant={active ? "secondary" : "ghost"}
                className="flex w-full flex-col items-start py-7"
              >
                <p className="">{p.title}</p>
                <p className="justify-start text-sm text-muted-foreground">
                  {p.publishedAt?.toDateString() ?? p.updatedAt.toDateString()}
                </p>
              </Button>
            </Link>
          )
        })}
      </div>
    </ListContainer>
  )
}
