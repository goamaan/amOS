"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Trash } from "lucide-react"
import { signOut } from "next-auth/react"
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

export function DeleteUser({ id }: { id: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id,
    },
  })

  const router = useRouter()

  const { mutateAsync } = api.user.delete.useMutation()

  function onSubmit(values: z.infer<typeof formSchema>) {
    return mutateAsync(values, {
      onError(error) {
        toast.error(error.message)
      },
      async onSuccess() {
        router.push("/")
        router.refresh()
      },
    })
  }

  return (
    <div className="flex justify-center">
      <DeleteDialog
        trigger={
          <Button className="flex gap-2" variant={"destructive"} size="sm">
            <Trash size={14} /> Delete your account
          </Button>
        }
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <SubmitButton
              variant={"destructive"}
              className="w-fit"
              isPending={form.formState.isSubmitting}
              size={"sm"}
            >
              Delete account & sign out
            </SubmitButton>
          </form>
        </Form>
      </DeleteDialog>
    </div>
  )
}
