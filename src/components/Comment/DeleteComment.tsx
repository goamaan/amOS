"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { DeleteDialog } from "~/components/DeleteDialog"
import { SubmitButton } from "~/components/submit-button"
import { Button } from "~/components/ui/button"
import { Form } from "~/components/ui/form"
import { api } from "~/trpc/react"

const formSchema = z.object({
  id: z.string(),
})

export function DeleteComment({ id }: { id: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id,
    },
  })

  const router = useRouter()

  const { mutateAsync } = api.comment.delete.useMutation()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateAsync(values, {
      onError(error) {
        toast.error(error.message)
      },
      onSuccess() {
        toast.success("Your comment was deleted")
        router.refresh()
      },
    })
  }

  return (
    <div className="flex justify-center">
      <DeleteDialog
        trigger={
          <Button variant={"ghost"} size="icon">
            <X size={14} />
          </Button>
        }
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <SubmitButton
              variant={"destructive"}
              className="w-fit"
              isPending={form.formState.isSubmitting}
            >
              Delete
            </SubmitButton>
          </form>
        </Form>
      </DeleteDialog>
    </div>
  )
}
