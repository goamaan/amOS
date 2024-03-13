"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { SubmitButton } from "~/components/submit-button"
import { Badge } from "~/components/ui/badge"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Spinner } from "~/components/ui/spinner"
import { api } from "~/trpc/react"

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Tag must be at least 2 characters.",
    })
    .max(50, {
      message: "Tag must be less than 50 characters.",
    }),
})

export function BookmarkTags() {
  const {
    data: tags,
    isFetching,
    isError,
    error,
  } = api.bookmark.getTags.useQuery()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { mutateAsync: createTagMutate } = api.bookmark.createTag.useMutation()
  const { mutateAsync: deleteTagMutate } = api.bookmark.deleteTag.useMutation()

  const createTag = async ({ name }: z.infer<typeof formSchema>) => {
    await createTagMutate(
      { name },
      {
        onError(error) {
          toast.error(error.message)
        },
        onSuccess() {
          toast.success("Bookmark Tag created")
        },
      },
    )
  }

  const deleteTag = async (id: string) => {
    await deleteTagMutate(
      { id },
      {
        onError(error) {
          toast.error(error.message)
        },
        onSuccess() {
          toast.success("Bookmark Tag deleted")
        },
      },
    )
  }

  if (isFetching) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    )
  }

  if (isError || !tags) return <p>Error loading tags... {error?.message}</p>

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <div key={t.id} className="flex items-center gap-0.5">
            <Badge variant={"secondary"}>{t.name}</Badge>
            <X
              onClick={() => deleteTag(t.id)}
              className="cursor-pointer"
              size={14}
            />
          </div>
        ))}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(createTag)}
          className="flex w-full items-center gap-2 space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Tag name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            isPending={form.formState.isSubmitting}
            variant={"default"}
            className="self-end"
            size={"icon"}
          >
            <Plus size={16} />
          </SubmitButton>
        </form>
      </Form>
    </div>
  )
}
