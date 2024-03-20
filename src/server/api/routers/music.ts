import { env } from "~/env"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"

type Image = {
  size: string
  "#text": string
}

type Track = {
  artist: {
    mbid: string
    "#text": string // This represents the text content within the <artist> tag
  }
  name: string
  mbid: string
  album: {
    mbid: string
    "#text": string // This represents the text content within the <album> tag
  }
  "@attr"?: {
    nowplaying: string
  }
  url: string
  date: {
    uts: string
    "#text": string // This represents the text content within the <date> tag
  }
  image: Image[]
  streamable: "0" | "1"
}

type RecentTracksResponse = {
  recenttracks: {
    user: string
    page: string
    perPage: string
    totalPages: string
    track: Track[]
  }
}

type Artist = {
  streamable: string
  image: Image[]
  mbid: string
  url: string
  playcount: string
  "@attr": {
    rank: string
  }
  name: string
}

type TopArtistsResponse = {
  topartists: {
    artist: Artist[]
  }
}

type TopTracksResponse = {
  toptracks: {
    track: {
      artist: {
        mbid: string
        url: string
        name: string
      }
      name: string
      mbid: string
      album: {
        mbid: string
        "#text": string // This represents the text content within the <album> tag
      }
      "@attr"?: {
        nowplaying: string
      }
      url: string
      date: {
        uts: string
        "#text": string // This represents the text content within the <date> tag
      }
      image: Image[]
      streamable: "0" | "1"
    }[]
  }
}

export const musicRouter = createTRPCRouter({
  getLastPlayed: publicProcedure.query(async ({}) => {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=goamaan&api_key=${env.LASTFM_API_KEY}&format=json&limit=5`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    if (response.status !== 200) {
      return []
    }

    const data = (await response.json()) as RecentTracksResponse

    return data.recenttracks.track.sort((a) =>
      a["@attr"]?.nowplaying === "true" ? -1 : 1,
    )
  }),

  getTopTracks: publicProcedure.query(async ({}) => {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=goamaan&api_key=${env.LASTFM_API_KEY}&format=json&limit=5&period=1month`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    if (response.status !== 200) {
      return []
    }

    const data = (await response.json()) as TopTracksResponse

    return data.toptracks.track
  }),

  getTopArtists: publicProcedure.query(async ({}) => {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=goamaan&api_key=${env.LASTFM_API_KEY}&format=json&limit=5&period=1month`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    if (response.status !== 200) {
      return []
    }

    const data = (await response.json()) as TopArtistsResponse

    return data.topartists.artist
  }),
})
