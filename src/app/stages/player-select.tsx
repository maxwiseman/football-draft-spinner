"use client";

import { api } from "@/trpc/react";
import { IconNumber, IconRuler2, IconWeight } from "@tabler/icons-react";
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
import { useState } from "react";
import Image from "next/image";

export default function PlayerSelect({ teamId }: { teamId?: string }) {
  const teamRoster = api.espn.getTeamRoster.useQuery(
    { teamId: teamId ?? "0" },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );
  const [accordionValue, setAccordionValue] = useState<string>("");

  return (
    <Card
      className={"m-6 w-full"}
      // style={{ backgroundColor: "#" + teamRoster.data?.team.color }}
    >
      <CardTitle className="m-4 flex flex-row items-center gap-2">
        <Image
          height={40}
          width={40}
          alt={teamRoster.data?.team.abbreviation + " Logo"}
          src={teamRoster.data?.team.logo ?? ""}
          className="aspect-square h-10"
        />
        {teamRoster.data?.team.displayName}
      </CardTitle>
      <Separator />
      <CardContent className="mt-4 space-y-2">
        <Accordion
          value={accordionValue}
          onValueChange={(value) => {
            setAccordionValue(value);
          }}
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
                  ? teamRoster.data.athletes[0]?.items.map((player) => {
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
                  ? teamRoster.data.athletes[0]?.items.map((player) => {
                      return <Player key={player.id} player={player} />;
                    })
                  : null}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
  function Player({ player }: { player: Player }) {
    return (
      <HoverCard openDelay={1000}>
        <HoverCardContent className=" flex max-h-min w-max min-w-[20rem] flex-row flex-nowrap gap-2">
          <Avatar className="inline-block h-12 w-auto">
            <AvatarImage
              className="aspect-square object-cover"
              style={{
                background: "#" + teamRoster.data?.team.color,
              }}
              src={player.headshot.href}
              alt={player.headshot.alt}
            />
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
              setAccordionValue("");
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
                src={player.headshot.href}
                alt={player.headshot.alt}
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
