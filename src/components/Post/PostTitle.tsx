"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type Post } from "@prisma/client"
import { type Session } from "next-auth"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useDebouncedCallback } from "use-debounce"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { api } from "~/trpc/react"

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(50),
})

export function PostTitle({
  post,
  user,
}: {
  post: Post
  user?: Session["user"]
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
    },
  })
  const router = useRouter()
  const { mutateAsync } = api.post.updateTitle.useMutation()

  const debouncedUpdates = useDebouncedCallback(async (newTitle: string) => {
    const valid = await form.trigger("title")
    if (!valid) return
    await mutateAsync({ id: post.id, title: newTitle })
    router.refresh()
  }, 1000)

  if (user?.isAdmin) {
    return (
      <Form {...form}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-fit min-w-96"
                  onChange={async (e) => {
                    field.onChange(e)
                    await debouncedUpdates(e.target.value)
                  }}
                />
              </FormControl>
              <FormDescription>Title of the post</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    )
  }

  return <h1 className="text-3xl font-bold">{post.title}</h1>
}
