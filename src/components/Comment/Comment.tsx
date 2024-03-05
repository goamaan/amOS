"use client"

import { type Comment } from "@prisma/client"
import { type Session } from "next-auth"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { api } from "~/trpc/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Check, MoreHorizontal } from "lucide-react"
import { DeleteDialog } from "~/components/DeleteDialog"
import { SubmitButton } from "~/components/submit-button"
import { DeleteComment } from "~/components/Comment/DeleteComment"
import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
        onSuccess(data) {
          toast.success("Your comment was updated")
          router.refresh()
        },
      },
    )
  }

  return (
    <div className="group flex flex-col space-y-0">
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
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Edit</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <DeleteComment id={comment.id} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-col space-y-3 pl-14">
          {/* <Textarea
          onChange={(e) => setEditText(e.target.value)}
          value={editText}
          onKeyDown={onKeyDown}
        />
        <div className="flex justify-between">
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          <PrimaryButton
            disabled={editText.trim().length === 0 || isSavingEdit}
            onClick={handleSaveEdit}
          >
            {isSavingEdit ? <LoadingSpinner /> : 'Save'}
          </PrimaryButton>
        </div> */}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="w-fit min-w-96" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <SubmitButton
                  isPending={form.formState.isSubmitting}
                  variant={"default"}
                >
                  <Check size={16} />
                </SubmitButton>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <Textarea defaultValue={comment.text} />
      )}
    </div>
  )
}
