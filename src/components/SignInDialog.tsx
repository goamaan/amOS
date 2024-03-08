import {
  Github,
  Heart,
  MessageSquareMore,
  MessagesSquare,
  MoreHorizontal,
} from "lucide-react"
import { signIn } from "next-auth/react"
import { Button } from "~/components/ui/button"
import { Card, CardHeader } from "~/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

export function SignInDialog({ trigger }: { trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="m-4 flex gap-2">
            <Github size={16} /> Sign in
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in with Github</DialogTitle>
        </DialogHeader>
        <div className="grid grid-flow-col grid-rows-2 gap-4">
          <Card>
            <CardHeader className="flex flex-col items-center justify-center gap-2">
              <MessagesSquare size={16} />
              Ask me anything
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-col items-center justify-center gap-2">
              <MessageSquareMore size={16} />
              Comment on my posts
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-col items-center justify-center gap-2">
              <Heart size={16} />
              Like and save links
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-col items-center justify-center gap-2">
              <MoreHorizontal size={16} />
              More coming soon...
            </CardHeader>
          </Card>
        </div>
        <Button onClick={() => signIn("github")} className="m-4 flex gap-2">
          <Github size={16} /> Sign in
        </Button>
        <DialogFooter className="text-xs text-muted-foreground">
          Delete your account any time. I will only request access to your
          public Github information. You won&apos;t be subscribed to anything.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
