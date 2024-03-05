"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { SubmitButton } from "~/components/submit-button"
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

export function AddPostForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  const router = useRouter()

  const { mutateAsync } = api.post.create.useMutation()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    return mutateAsync(values, {
      onError(error) {
        toast.error(error.message)
      },
      onSuccess(data) {
        toast.success("Post created")
        router.refresh()
        router.push(`/writing/${data.slug}`)
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="My first post..." {...field} />
              </FormControl>
              <FormDescription>Title of the post</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <SubmitButton
            isPending={form.formState.isSubmitting}
            variant={"default"}
          >
            Create
          </SubmitButton>
        </div>
      </form>
    </Form>
  )
}
