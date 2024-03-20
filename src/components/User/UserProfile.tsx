import { type User } from "@prisma/client"
import { type Session } from "next-auth"
import { DotBackground } from "~/components/DotBackground"
import { TitleBar } from "~/components/TitleBar"
import { DeleteUser } from "~/components/User/DeleteUser"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"

export function UserProfile({
  user,
  currentUser,
}: {
  user: User
  currentUser?: Session["user"]
}) {
  return (
    <DotBackground>
      <div className="relative flex max-h-screen w-full flex-col space-y-4 overflow-y-auto">
        <TitleBar hasBgColor={false} title={user.name ?? "User profile"} />
        <div className="flex w-full flex-col items-center justify-center gap-2 pt-20">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
          </Avatar>
          {user.name && <p className="text-2xl font-bold">{user.name}</p>}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://twitter.com/${user.username}`}
          >
            <Button variant="link" className="text-lg">
              Twitter: @{user.username}
            </Button>
          </a>
          {currentUser?.id === user.id && <DeleteUser id={user.id} />}
        </div>
      </div>
    </DotBackground>
  )
}
