"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, MoreHorizontal } from "lucide-react"
import { type Session } from "next-auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { DeleteComment } from "~/components/Comment/DeleteComment"
import { SubmitButton } from "~/components/submit-button"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form"
import { Textarea } from "~/components/ui/textarea"
import { api } from "~/trpc/react"

const formSchema = z.object({
  text: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(50),
})

export function Comment({
  comment,
  user,
}: {
  comment: {
    id: string
    updatedAt: Date
    author: {
      name: string | null
      image: string | null
      id: string | null
    }
    text: string
  }
  user?: Session["user"]
}) {
  const { mutateAsync } = api.comment.update.useMutation()
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: comment.text,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    return mutateAsync(
      { id: comment.id, text: values.text },
      {
        onError(error) {
          toast.error(error.message)
        },
        onSuccess() {
          toast.success("Your comment was updated")
          router.refresh()
        },
      },
    )
  }

  return (
    <div className="group group flex flex-col space-y-0">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <Link href={`/profile/${comment.author.id}`} className="inline-flex">
            <Avatar>
              <AvatarImage src={comment.author.image ?? undefined} />
              <AvatarFallback>{comment.author.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex space-x-1">
            <Link
              href={`/profile/${comment.author.id}`}
              className="font-semibold leading-snug text-primary"
            >
              <div className="line-clamp-1 flex break-all">
                {comment.author.name}
              </div>
            </Link>
            <p className="text-quaternary leading-snug">·</p>
            <p className="text-quaternary line-clamp-1 leading-snug">
              {comment.updatedAt.toDateString()}
            </p>
          </div>
        </div>

        {(user?.isAdmin ?? user?.id === comment.author.id) && (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontal size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteComment id={comment.id} />
          </div>
        )}
      </div>

      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full items-start gap-2"
          >
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton
              isPending={form.formState.isSubmitting}
              variant={"default"}
            >
              <Check size={16} />
            </SubmitButton>
          </form>
        </Form>
      ) : (
        <div className="flex-grow pl-14 leading-normal text-muted-foreground">
          {comment.text}
        </div>
      )}
    </div>
  )
}
