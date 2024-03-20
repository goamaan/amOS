import Image from "next/image"
import Link from "next/link"
import { DotBackground } from "~/components/DotBackground"
import { TitleBar } from "~/components/TitleBar"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/server"

export async function Music() {
  const tracks = await api.music.getLastPlayed()
  const nowPlaying = tracks.filter((t) => t["@attr"]?.nowplaying === "true")[0]
  const topArtists = await api.music.getTopArtists()
  const topTracks = await api.music.getTopTracks()

  return (
    <DotBackground>
      <div className="relative flex max-h-screen w-full flex-col overflow-y-auto">
        <TitleBar hasBgColor={false} title="" />
        <div className="flex flex-col space-y-4 px-8">
          <div className="flex flex-col space-y-1">
            <h1 className="font-mono text-xl">Spotify stats</h1>
            <p className="text-sm font-light text-muted-foreground">
              Powered by{" "}
              <a
                className="prose text-primary"
                target="_blank"
                rel="noopener noreferrer"
                href="https://last.fm"
              >
                Last.fm
              </a>
              {". "}
              These are suprisingly accurate.
            </p>
          </div>
          <div
            className={cn(
              "flex flex-col gap-2",
              !nowPlaying && "rounded border p-4",
            )}
          >
            <p className="text-sm font-semibold">Currently listening to:</p>
            {nowPlaying ? (
              <div className="flex gap-4 rounded-lg bg-secondary/70 p-4">
                <Image
                  src={nowPlaying.image.at(2)?.["#text"] ?? ""}
                  alt={nowPlaying.name}
                  width={64}
                  height={64}
                  className="rounded-lg"
                />
                <div className="flex flex-col gap-1">
                  <Link
                    href={nowPlaying.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {nowPlaying.name}
                  </Link>
                  <Link
                    href={nowPlaying.url.substring(
                      0,
                      nowPlaying.url.split("/").slice(0, 5).join("/").length +
                        1,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-light text-muted-foreground hover:underline"
                  >
                    {nowPlaying.artist["#text"]}
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-sm font-light text-muted-foreground">
                Nothing, just my thoughts...
              </p>
            )}
          </div>
          <div className="flex flex-wrap justify-evenly gap-2">
            <div className="mx-auto flex w-72 flex-grow flex-col space-y-2 rounded-lg border p-4">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-lg font-semibold">Last few songs played</h2>
                <p className="text-sm font-light text-muted-foreground">
                  If a song appears more than once, it&apos;s cause I&apos;m
                  listening to it on repeat...
                </p>
              </div>
              {tracks.slice(1).map((t) => (
                <div key={t.name}>
                  <div className="flex w-full justify-between rounded-lg border bg-secondary/60 p-4">
                    <Image
                      src={t.image.at(3)?.["#text"] ?? ""}
                      alt={t.name}
                      width={48}
                      height={48}
                      className="rounded-lg"
                    />
                    <div className="flex flex-col items-end gap-1">
                      <Link
                        href={t.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {t.name.substring(0, 30) +
                          (t.name.length > 30 ? "..." : "")}
                      </Link>
                      <Link
                        href={t.url.substring(
                          0,
                          t.url.split("/").slice(0, 5).join("/").length + 1,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-light text-muted-foreground hover:underline"
                      >
                        {t.artist["#text"]}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mx-auto flex w-72 flex-grow flex-col space-y-2 rounded-lg border p-4">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-lg font-semibold">Top tracks</h2>
                <p className="text-sm font-light text-muted-foreground">
                  in the last month
                </p>
              </div>
              {topTracks.map((t) => (
                <div key={t.name}>
                  <div className="flex w-full justify-between rounded-lg border bg-secondary/60 p-4">
                    <Image
                      src={t.image.at(3)?.["#text"] ?? ""}
                      alt={t.name}
                      width={48}
                      height={48}
                      className="rounded-lg"
                    />
                    <div className="flex flex-col items-end gap-1">
                      <Link
                        href={t.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {t.name.substring(0, 30) +
                          (t.name.length > 30 ? "..." : "")}
                      </Link>
                      <Link
                        href={t.url.substring(
                          0,
                          t.url.split("/").slice(0, 5).join("/").length + 1,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-light text-muted-foreground hover:underline"
                      >
                        {t.artist.name}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mx-auto flex w-72 flex-grow flex-col space-y-2 rounded-lg border p-4">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-lg font-semibold">Top artists</h2>
                <p className="text-sm font-light text-muted-foreground">
                  in the last month
                </p>
              </div>
              {topArtists.map((t) => (
                <div key={t.name}>
                  <div className="flex w-full rounded-lg border bg-secondary/60 p-4">
                    <Link
                      href={t.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {t.name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DotBackground>
  )
}
