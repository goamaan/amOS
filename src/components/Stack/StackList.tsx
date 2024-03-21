import { type StackTag, type Stack } from "@prisma/client"
import { Plus, Tag } from "lucide-react"
import { type Session } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { ListContainer } from "~/components/ListContainer"
import { AddStackForm } from "~/components/Stack/AddStack"
import { StackTags } from "~/components/Stack/StackTags"
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

function AddStackDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl py-10">
        <DialogHeader>
          <DialogTitle>Add an item to the stack</DialogTitle>
        </DialogHeader>
        <AddStackForm />
      </DialogContent>
    </Dialog>
  )
}

function AddStackTagDialog() {
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
        <StackTags />
      </DialogContent>
    </Dialog>
  )
}

export async function StackList({
  params,
  user,
  stacks,
}: {
  params: { slug: string }
  user?: Session["user"]
  stacks: (Stack & { tag: StackTag })[]
}) {
  return (
    <ListContainer>
      <TitleBar
        hasBgColor
        title={"Stack"}
        trailingAccessory={
          user?.isAdmin ? (
            <div className="flex gap-1">
              <AddStackTagDialog />
              <AddStackDialog />
            </div>
          ) : null
        }
      />
      <div className="flex flex-col items-start gap-2 p-2 text-start">
        {stacks.map((p) => {
          const active = params.slug === p.slug
          return (
            <Link key={p.id} href={`/stack/${p.slug}`} className="w-full">
              <Button
                variant={active ? "secondary" : "ghost"}
                className="flex w-full items-center justify-between gap-2 py-7"
              >
                <div className="flex gap-2">
                  <Image
                    width={40}
                    height={40}
                    className="rounded"
                    alt="stack item image"
                    src={p.image}
                  />
                  <div className="flex flex-col items-start justify-start">
                    <p>{p.name}</p>
                  </div>
                </div>
                <Badge className="flex items-center gap-1 self-start text-xs">
                  <Tag size={12} /> {p.tag.name}
                </Badge>
              </Button>
            </Link>
          )
        })}
      </div>
    </ListContainer>
  )
}
