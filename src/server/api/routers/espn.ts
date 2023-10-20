import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const espnRouter = createTRPCRouter({
  getTeams: publicProcedure
    // .input(z.object({ text: z.string() }))
    .query(async () => {
      const data = (await fetch(
        "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams",
      ).then((response) => response.json())) as TeamsResponse;

      return data.sports[0]?.leagues[0]?.teams;
    }),

  getPlayersByTeam: protectedProcedure
    .input(z.object({ teamId: z.string().min(1) }))
    .query(() => {
      return {
        greeting: `Hello there`,
      };
    }),
});

interface TeamsResponse {
  sports: {
    leagues: {
      teams: Team[];
    }[];
  }[];
}

interface Team {
  team: {
    id: string;
    uid: string;
    slug: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
    name: string;
    nickname: string;
    location: string;
    color: string;
    alternateColor: string;
    isActive: boolean;
    isAllStar: boolean;
    logos: {
      href: string;
      alt: string;
      rel: string[];
      width: number;
      height: number;
    }[];
    links: {
      language: string;
      rel: string[];
      href: string;
      text: string;
      shortText: string;
      isExternal: boolean;
      isPremium: boolean;
      isHidden: boolean;
    }[];
  };
}
