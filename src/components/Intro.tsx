import { MapPin } from "lucide-react"
import { type Session } from "next-auth"
import Image from "next/image"
import { DotBackground } from "~/components/DotBackground"
import { IntroEditor } from "~/components/Intro/IntroEditor"
import { TitleBar } from "~/components/TitleBar"
import { Editor } from "~/components/editor/editor"
import { api } from "~/trpc/server"

function SectionTitle(props: { children?: React.ReactNode }) {
  return (
    <h4
      className="col-span-2 pt-8 text-lg font-extrabold text-black dark:text-white md:pt-0 md:text-right md:text-base md:font-normal md:text-opacity-40"
      {...props}
    />
  )
}

function SectionContent(props: { children: React.ReactNode }) {
  return <div className="col-span-10" {...props} />
}

interface TableRowProps {
  href: string
  title: string
  date: string
  subtitle?: string
}

function TableRow({ href, title, subtitle, date }: TableRowProps) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className="group flex items-center space-x-4"
    >
      <strong className="text-gray-1000 flex-none font-medium group-hover:text-cyan-400 group-hover:underline dark:text-gray-100 dark:group-hover:text-cyan-500">
        {title}
      </strong>
      <span className="w-full shrink border-t border-dashed border-gray-300 dark:border-gray-800" />
      {subtitle && (
        <span className="flex-none text-muted-foreground">{subtitle}</span>
      )}
      {date && (
        <span className="flex-none font-mono text-muted-foreground/60">
          {date}
        </span>
      )}
    </a>
  )
}

function SectionContainer(props: { children: React.ReactNode }) {
  return (
    <div
      className="grid grid-cols-1 items-start gap-6 md:grid-cols-12"
      {...props}
    />
  )
}

const workHistory = [
  {
    href: "https://sap.com",
    title: "SAP",
    subtitle: "Software Engineer Intern",
    date: "Feb '24 - Apr '24",
  },
  {
    href: "https://kabam.com",
    title: "Kabam",
    subtitle: "Backend Engineer Intern",
    date: "May '23 - Aug '23",
  },
  {
    href: "https://sap.com",
    title: "SAP",
    subtitle: "Software Engineer Intern",
    date: "Sep '21 - Aug '22",
  },
  {
    href: "https://science.ok.ubc.ca/awards/facultystaff/curgrants/",
    title: "UBC Computer Science",
    subtitle: "Research Assistant",
    date: "May '20 - Sep '23",
  },
  {
    href: "https://www.instagram.com/pathvisor",
    title: "PathVisor",
    subtitle: "CTO & Lead Developer",
    date: "Jun '20 - Sep '20",
  },
]

export async function Intro({ user }: { user?: Session["user"] }) {
  const intro = await api.user.getIntro()

  return (
    <DotBackground>
      <div className="relative flex max-h-screen w-full flex-col overflow-y-auto">
        <TitleBar hasBgColor={false} title="About me" />
        <div className="mx-auto w-full max-w-3xl px-4 py-12 pb-10 md:px-8">
          <SectionContainer>
            <SectionTitle />
            {user?.isAdmin ? (
              <IntroEditor intro={intro} />
            ) : (
              <div className="col-span-10">
                <Editor content={intro.content} />
              </div>
            )}
          </SectionContainer>
        </div>
        <div className="mx-auto flex w-full max-w-3xl flex-col space-y-8 px-4 py-12 pb-24 md:space-y-16 md:px-8">
          <SectionContainer>
            <SectionTitle>Online</SectionTitle>
            <SectionContent>
              <div className="flex flex-col space-y-3">
                <TableRow
                  href={"https://twitter.com/goamaan"}
                  title={"Twitter"}
                  subtitle={"Follow"}
                  date={""}
                />
                <TableRow
                  href={"https://github.com/goamaan"}
                  title={"GitHub"}
                  subtitle={"Follow"}
                  date={""}
                />
                <TableRow
                  href={
                    "https://open.spotify.com/user/amaangokak1807?si=b8774ea04ede40d0"
                  }
                  title={"Spotify"}
                  subtitle={"Follow"}
                  date={""}
                />
              </div>
            </SectionContent>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Where</SectionTitle>
            <SectionContent>
              <Image
                priority
                src="/static/vancouver.png"
                width={800}
                height={400}
                layout="responsive"
                className="rounded-2xl"
                quality={100}
                alt="Map of Vancouver with blue location dot in the middle"
              />
              <p className="text-quaternary flex items-center justify-end space-x-2 pt-2 text-sm md:text-right">
                <MapPin size={12} />
                <span>Vancouver, BC</span>
              </p>
            </SectionContent>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Work</SectionTitle>
            <SectionContent>
              <div className="flex flex-col space-y-3">
                {workHistory.map((job) => (
                  <TableRow
                    href={job.href}
                    title={job.title}
                    subtitle={job.subtitle}
                    date={job.date}
                    key={job.href}
                  />
                ))}
              </div>
            </SectionContent>
          </SectionContainer>
        </div>
      </div>
    </DotBackground>
  )
}
