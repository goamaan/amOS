"use client"

import { Edit } from "lucide-react"
import { type Session } from "next-auth"
import Link from "next/link"
import { AddComment } from "~/components/Comment/AddComment"
import { CommentList } from "~/components/Comment/CommentList"
import { DotBackground } from "~/components/DotBackground"
import { LikeButton } from "~/components/LikeButton"
import { DeleteQuestion } from "~/components/Question/DeleteQuestion"
import { EditQuestionForm } from "~/components/Question/EditQuestion"
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
import { Spinner } from "~/components/ui/spinner"
import { api } from "~/trpc/react"

export function QuestionDetail({
  id,
  user,
}: {
  id: string
  user?: Session["user"]
}) {
  const {
    data: question,
    isLoading,
    isError,
  } = api.question.get.useQuery({ id })

  if (isLoading) {
    return (
      <div className="relative flex max-h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (isError || !question) {
    return <p>Error loading question...</p>
  }

  return (
    <DotBackground>
      <div className="relative flex max-h-screen w-full flex-col space-y-4 overflow-y-auto">
        <TitleBar
          hasBgColor={false}
          title={question.title}
          trailingAccessory={
            <LikeButton id={question.id} user={user} type="question" />
          }
        />
        <div className="m-20 flex flex-col space-y-4">
          {(user?.isAdmin ?? user?.id === question.userId) && (
            <div className="mb-4 flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2" size={"sm"}>
                    <Edit size={12} /> Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Question</DialogTitle>
                  </DialogHeader>
                  <EditQuestionForm question={question} />
                </DialogContent>
              </Dialog>
              <DeleteQuestion id={question.id} />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${question.author.id}`}
              className="inline-flex"
            >
              <Avatar>
                <AvatarImage src={question.author.image ?? undefined} />
                <AvatarFallback>
                  {question.author.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <Link
              href={`/profile/${question.author.id}`}
              className="inline-flex font-semibold"
            >
              {question.author.name}
            </Link>
            <p>·</p>
            <p>{question.createdAt.toLocaleDateString()}</p>
          </div>
          <h1 className="text-4xl font-semibold">{question.title}</h1>
          <p className="italic text-muted-foreground">{question.description}</p>
          <div className="pt-8">
            <CommentList id={question.id} type="question" user={user} />
            {user && <AddComment id={question.id} type="question" />}
          </div>
        </div>
      </div>
    </DotBackground>
  )
}
