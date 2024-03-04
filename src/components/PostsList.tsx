import { ListContainer } from "~/components/ListContainer"
import { TitleBar } from "~/components/TitleBar"
import { Button } from "~/components/ui/button"
interface Post {
  id: number
  title: string
  date: Date
}

function generateFakePosts(count: number): Post[] {
  const posts: Post[] = []
  const titles = [
    "Lorem Ipsum",
    "Dolor Sit Amet",
    "Consectetur Adipiscing Elit",
    "Sed Do Eiusmod Tempor",
    "Incididunt Ut Labore Et Dolore",
    "Magna Aliqua Ut Enim Ad Minim",
    "Veniam, Quis Nostrud Exercitation",
    "Ullamco Laboris Nisi Ut Aliquip",
    "Ex Ea Commodo Consequat",
    "Duis Aute Irure Dolor",
  ]

  for (let i = 0; i < count; i++) {
    const randomTitleIndex = Math.floor(Math.random() * titles.length)
    const post: Post = {
      id: i + 1,
      title: titles[randomTitleIndex]!,
      date: randomDate(new Date(2023, 0, 1), new Date()),
    }
    posts.push(post)
  }

  return posts
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  )
}

const fakePosts = generateFakePosts(50)

export function PostsList() {
  return (
    <ListContainer>
      <TitleBar hasBgColor title="Writing" />
      <div className="flex flex-col items-start gap-2 p-2 text-start">
        {fakePosts.map((p) => (
          <Button
            variant={"ghost"}
            className="flex w-full flex-col items-start py-7"
            key={p.id}
          >
            <p className="">{p.title}</p>
            <p className="justify-start text-sm text-muted-foreground">
              {p.date.toDateString()}
            </p>
          </Button>
        ))}
      </div>
    </ListContainer>
  )
}
