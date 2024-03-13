import { type Question } from "@prisma/client"
import { Plus } from "lucide-react"
import { type Session } from "next-auth"
import Link from "next/link"
import { ListContainer } from "~/components/ListContainer"
import { AddQuestionForm } from "~/components/Question/AddQuestion"
import { SignInDialog } from "~/components/SignInDialog"
import { TitleBar } from "~/components/TitleBar"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

function AddQuestionDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl py-10">
        <DialogHeader>
          <DialogTitle>Ask a question</DialogTitle>
        </DialogHeader>
        <AddQuestionForm />
      </DialogContent>
    </Dialog>
  )
}

export async function QuestionsList({
  params,
  user,
  questions,
}: {
  params: { id: string }
  user?: Session["user"]
  questions: (Question & {
    author: { name: string | null; image: string | null; id: string }
  })[]
}) {
  return (
    <ListContainer>
      <TitleBar
        hasBgColor
        title={"Questions"}
        trailingAccessory={
          user ? (
            <AddQuestionDialog />
          ) : (
            <SignInDialog
              trigger={
                <Button variant="ghost" size="icon">
                  <Plus size={16} />
                </Button>
              }
            />
          )
        }
      />
      <div className="flex flex-col items-start gap-2 p-2 text-start">
        {questions.map((p) => {
          const active = params.id === p.id
          return (
            <Link key={p.id} href={`/ama/${p.id}`} className="w-full">
              <Button
                variant={active ? "secondary" : "ghost"}
                className="flex w-full flex-col items-start gap-0.5 py-7"
              >
                <p className="">{p.title}</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={p.author.image ?? undefined} />
                    <AvatarFallback>{p.author.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="justify-start text-sm text-muted-foreground">
                    {p.author.name}
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
