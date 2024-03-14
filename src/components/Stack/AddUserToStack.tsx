"use client"

import { type Session } from "next-auth"
import { toast } from "sonner"
import { SignInDialog } from "~/components/SignInDialog"
import { Checkbox } from "~/components/ui/checkbox"
import { Label } from "~/components/ui/label"
import { api } from "~/trpc/react"

export function AddUserToStack({
  id,
  user,
  stackUsers,
}: {
  id: string
  user?: Session["user"]
  stackUsers: string[]
}) {
  const { mutateAsync } = api.stack.toggleUser.useMutation()

  const toggle = async () => {
    await mutateAsync(
      { id },
      {
        onError(error) {
          toast.error(error.message)
        },
        onSuccess(data) {
          return data.status === "added"
            ? toast.success("Added you to the stack users!", {
                description: "Good choice :)",
              })
            : toast.info("Removed you from the stack users", {
                description: "Stopped using this? Comment why!",
              })
        },
      },
    )
  }

  if (!user)
    return (
      <div className="flex items-center space-x-2">
        <SignInDialog trigger={<Checkbox checked={false} id="use" />} />
        <Label htmlFor="use">I use this</Label>
      </div>
    )

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        onClick={toggle}
        defaultChecked={stackUsers.includes(user?.id ?? "")}
        id="use"
      />
      <Label htmlFor="use">I use this</Label>
    </div>
  )
}
