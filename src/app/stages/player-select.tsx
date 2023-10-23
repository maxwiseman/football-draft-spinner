"use client";

import type { Team } from "@/server/api/routers/espn";
import { api } from "@/trpc/react";
import {
  IconNumber,
  IconPlus,
  IconRuler2,
  IconWeight,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Graduate } from "next/font/google";
import Image from "next/image";
import { useContext, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../_components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "../_components/ui/avatar";
import { Button } from "../_components/ui/button";
import { Card, CardContent, CardTitle } from "../_components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../_components/ui/hover-card";
import { Separator } from "../_components/ui/separator";
import { team as TeamContext } from "../providers";
const graduate = Graduate({
  weight: "400",
  subsets: ["latin"],
});

export default function PlayerSelect({ team }: { team?: Team }) {
  const teamRoster = api.espn.getTeamRoster.useQuery(
    { teamId: team?.id ?? "0" },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );
  const teamContext = useContext(TeamContext);
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player>();

  return (
    <Card
      className={"m-6 w-full overflow-hidden"}
      // style={{ backgroundColor: "#" + teamRoster.data?.team.color }}
    >
      <motion.div
        className="overflow-hidden"
        initial={{ height: 0 }}
        animate={{
          height: showPlayer ? "auto" : 0,
        }}
      >
        {selectedPlayer && (
          <>
            <div
              className="relative flex h-64 w-full flex-row items-center justify-between overflow-hidden"
              style={{
                color: `#${team?.alternateColor}`,
                background: `#${team?.color}`,
              }}
            >
              <span
                className={`absolute left-1/2 w-[110%] -translate-x-1/2 text-lg tracking-tighter text-white opacity-25 ${graduate.className}`}
              >
                {new Array(1000).join(selectedPlayer.jersey + " ")}
              </span>
              <Image
                className="rounded-xl object-contain"
                src={selectedPlayer.headshot.href ?? ""}
                alt={selectedPlayer.headshot.alt ?? ""}
                quality={100}
                fill
              />
            </div>
            <CardContent className="flex flex-col pt-4">
              <div className="flex w-full flex-row flex-nowrap items-center justify-between">
                <div>
                  <h2 className="line-clamp-1 border-0 !pb-0">
                    {selectedPlayer.displayName}
                  </h2>
                  <h6>{selectedPlayer.position.displayName}</h6>
                </div>
                <Button size={"sm"}>
                  <IconPlus className="h-4 w-4" />
                  Add to team
                </Button>
              </div>
              <Separator className="mb-4 mt-2" />
              <div className="flex max-h-24 min-w-max flex-col flex-wrap gap-x-2 pr-2 leading-5 text-muted-foreground">
                <div className="flex flex-row items-center gap-1">
                  <IconNumber className="inline-block h-4 w-4" />
                  <span>
                    Jersey: {selectedPlayer.jersey} <br />
                  </span>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <IconWeight className="inline-block h-4 w-4" />
                  <span>
                    Weight: {selectedPlayer.displayWeight} <br />
                  </span>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <IconRuler2 className="inline-block h-4 w-4" />
                  <span>
                    Height: {selectedPlayer.displayHeight} <br />
                  </span>
                </div>
              </div>
            </CardContent>
          </>
        )}
        <Separator />
      </motion.div>
      <CardTitle
        onClick={() => {
          if (showPlayer) setShowPlayer(false);
          if (!showPlayer && selectedPlayer) setShowPlayer(true);
        }}
        className="m-4 flex cursor-pointer flex-row items-center gap-2"
      >
        {teamRoster.isFetched && (
          <Image
            height={40}
            width={40}
            alt={teamRoster.data?.team.abbreviation + " Logo"}
            src={teamRoster.data?.team.logo ?? ""}
            className="aspect-square h-10"
            quality={50}
          />
        )}
        {teamRoster.data?.team.displayName ?? "Loading..."}
      </CardTitle>
      <motion.div
        initial={{ height: "min-content" }}
        animate={{ height: showPlayer ? 0 : "min-content" }}
      >
        <Separator />
        <CardContent className="mt-4 space-y-2">
          <Accordion
            // value={accordionValue}
            // onValueChange={(value) => {
            //   setAccordionValue(value);
            // }}
            type="single"
            collapsible
          >
            <AccordionItem value="offense">
              <AccordionTrigger className="font-semibold">
                Offense
              </AccordionTrigger>
              <AccordionContent>
                <div className="my-4 flex flex-row flex-wrap justify-center gap-1">
                  {teamRoster.data
                    ? teamRoster.data.athletes[0]?.items.map((player) => {
                        return <Player key={player.id} player={player} />;
                      })
                    : null}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="defense">
              <AccordionTrigger className="font-semibold">
                Defense
              </AccordionTrigger>
              <AccordionContent>
                <div className="my-4 flex flex-row flex-wrap justify-center gap-1">
                  {teamRoster.data
                    ? teamRoster.data.athletes[1]?.items.map((player) => {
                        return <Player key={player.id} player={player} />;
                      })
                    : null}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem className="border-b-0" value="special">
              <AccordionTrigger className="font-semibold">
                Special
              </AccordionTrigger>
              <AccordionContent>
                <div className="my-4 flex flex-row flex-wrap justify-center gap-1">
                  {teamRoster.data
                    ? teamRoster.data.athletes[2]?.items.map((player) => {
                        return <Player key={player.id} player={player} />;
                      })
                    : null}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </motion.div>
    </Card>
  );
  function Player({ player }: { player: Player }) {
    return (
      <HoverCard>
        <HoverCardContent className=" flex max-h-min w-max min-w-[20rem] flex-row flex-nowrap gap-2">
          <Avatar className="inline-block h-12 w-auto">
            <AvatarImage
              className="aspect-square object-cover"
              style={{
                background: "#" + teamRoster.data?.team.color,
              }}
              src={player.headshot.href ?? ""}
              alt={player.headshot.alt ?? ""}
              asChild
            >
              <Image
                src={player.headshot.href ?? ""}
                alt={player.headshot.alt ?? ""}
                width={48}
                height={48}
                quality={100}
              />
            </AvatarImage>
            <AvatarFallback className="aspect-square">
              {player.firstName.charAt(0) + player.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex h-max max-h-60 min-h-max min-w-max flex-col gap-2">
            <div>
              <h4>{player.fullName}</h4>
              <h6>{player.position.displayName}</h6>
            </div>
            <div className="!mt-0 flex max-h-24 min-w-max flex-col flex-wrap gap-x-2 pr-2 leading-5 text-muted-foreground">
              <div className="flex flex-row items-center gap-1">
                <IconNumber className="inline-block h-4 w-4" />
                <span>
                  Jersey: {player.jersey} <br />
                </span>
              </div>
              <div className="flex flex-row items-center gap-1">
                <IconWeight className="inline-block h-4 w-4" />
                <span>
                  Weight: {player.displayWeight} <br />
                </span>
              </div>
              <div className="flex flex-row items-center gap-1">
                <IconRuler2 className="inline-block h-4 w-4" />
                <span>
                  Height: {player.displayHeight} <br />
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
        <HoverCardTrigger>
          <Button
            onClick={() => {
              setShowPlayer(true);
              setSelectedPlayer(player);
            }}
            variant={"outline"}
            size={"sm"}
            className="h-min p-1"
          >
            <div className="flex aspect-square h-7 items-center justify-center">
              <Image
                className="rounded-sm object-cover"
                height={28}
                width={28}
                src={player.headshot.href ?? ""}
                alt={player.headshot.alt ?? ""}
                quality={25}
              />
            </div>
          </Button>
        </HoverCardTrigger>
      </HoverCard>
    );
  }
}

interface Player {
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
}
