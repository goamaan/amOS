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
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form"
import { Textarea } from "~/components/ui/textarea"
import { api } from "~/trpc/react"

const formSchema = z.object({
  text: z
    .string()
    .min(1, { message: "Comment cannot be empty" })
    .max(500, { message: "Comment cannot exceed 500 characters" }),
})

export function AddComment({
  id,
  type,
}: {
  id: string
  type: "post" | "bookmark" | "stack" | "work" | "question"
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  })
  const router = useRouter()

  const { mutateAsync } = api.comment.add.useMutation()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    return mutateAsync(
      { id, type, text: values.text },
      {
        onError(error) {
          toast.error(error.message)
        },
        onSuccess() {
          toast.success("Added a comment")
          form.reset()
          router.refresh()
        },
      },
    )
  }

  return (
    <div className="flex">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="m-4 flex w-full flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea rows={4} {...field} />
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
              Add
            </SubmitButton>
          </div>
        </form>
      </Form>
    </div>
  )
}
