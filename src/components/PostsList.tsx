import { Plus } from "lucide-react"
import Link from "next/link"
import { ListContainer } from "~/components/ListContainer"
import { TitleBar } from "~/components/TitleBar"
import { AddPostForm } from "~/components/forms/AddPost"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

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

export async function PostsList({ params }: { params: { slug: string } }) {
  const session = await getServerAuthSession()
  const posts = await api.post.getAll.query()

  return (
    <ListContainer>
      <TitleBar
        hasBgColor
        title="Writing"
        trailingAccessory={session?.user.isAdmin ? <AddPostDialog /> : null}
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
