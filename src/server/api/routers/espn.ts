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

  getPlayersByTeam: publicProcedure
    .input(z.object({ teamId: z.string().min(1) }))
    .query(() => {
      return {
        greeting: `Hello there`,
      };
    }),

  getTeamRoster: publicProcedure
    .input(z.object({ teamId: z.string().min(1) }))
    .query(async (input) => {
      const data = (await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${input.input.teamId}/roster`,
      ).then((response) => response.json())) as RosterData;
      return data;
    }),
});

interface TeamsResponse {
  sports: {
    leagues: {
      teams: { team: Team }[];
    }[];
  }[];
}

export interface Team {
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
}

interface Athlete {
  position: string;
  items: {
    id: string;
    uid: string;
    guid: string;
    alternateIds: {
      sdr: string;
    };
    firstName: string;
    lastName: string;
    fullName: string;
    displayName: string;
    shortName: string;
    weight: number;
    displayWeight: string;
    height: number;
    displayHeight: string;
    age: number;
    dateOfBirth: string;
    links: {
      language: string;
      rel: string[];
      href: string;
      text: string;
      shortText: string;
      isExternal: boolean;
      isPremium: boolean;
    }[];
    birthPlace: {
      city: string;
      state: string;
      country: string;
    };
    college: {
      id: string;
      mascot: string;
      name: string;
      shortName: string;
      abbrev: string;
    };
    slug: string;
    headshot: {
      href: string;
      alt: string;
    };
    jersey: string;
    position: {
      id: string;
      name: string;
      displayName: string;
      abbreviation: string;
      leaf: boolean;
      parent: {
        id: string;
        name: string;
        displayName: string;
        abbreviation: string;
        leaf: boolean;
      };
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    injuries: any[]; // You may want to specify the interface of injuries
    teams: {
      $ref: string;
    }[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contracts: any[]; // You may want to specify the interface of contracts
    experience: {
      years: number;
    };
    status: {
      id: string;
      name: string;
      interface: string;
      abbreviation: string;
    };
  }[];
}

interface Season {
  year: number;
  displayName: string;
  interface: number;
  name: string;
}

interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  experience: number;
}

interface Team2 {
  id: string;
  abbreviation: string;
  location: string;
  name: string;
  displayName: string;
  clubhouse: string;
  color: string;
  logo: string;
  recordSummary: string;
  seasonSummary: string;
  standingSummary: string;
  groups: {
    $ref: string;
  };
}

interface RosterData {
  timestamp: string;
  status: string;
  season: Season;
  coach: Coach[];
  athletes: Athlete[];
  team: Team2;
}
