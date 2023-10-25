'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import {
  IconNumber,
  IconPlus,
  IconRuler2,
  IconUsers,
  IconWeight,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { Graduate } from 'next/font/google';
import Image from 'next/image';
import {
  type Dispatch,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { api } from '@/trpc/react';
import type { Team } from '@/server/api/routers/espn';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../_components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '../_components/ui/avatar';
import { Button } from '../_components/ui/button';
import { Card, CardContent, CardTitle } from '../_components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../_components/ui/hover-card';
import { Separator } from '../_components/ui/separator';
import { TeamContext } from '../providers';

const graduate = Graduate({
  weight: '400',
  subsets: ['latin'],
});

export function PlayerSelect({
  team,
  onSelect,
}: {
  team?: Team;
  onSelect: (arg0: Player) => void;
}): React.ReactNode {
  const teamRoster = api.espn.getTeamRoster.useQuery(
    { teamId: team?.id ?? '0' },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );
  const { team: teamContext, setTeam: setTeamContext } =
    useContext(TeamContext);
  const [expanded, setExpanded] = useState<'player' | 'team' | 'yourTeam'>(
    'team',
  );
  const [selectedPlayer, setSelectedPlayer] = useState<Player>();

  useEffect(() => {
    setSelectedPlayer(undefined);
    setExpanded('team');
  }, [team]);

  return (
    <Card
      className="m-6 w-full overflow-hidden"
      // style={{ backgroundColor: "#" + teamRoster.data?.team.color }}
    >
      <motion.div
        animate={{
          height: expanded === 'player' ? 'auto' : 0,
        }}
        className="overflow-hidden"
        initial={{ height: 0 }}
      >
        {selectedPlayer ? (
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
                {new Array(1000).join(`${selectedPlayer.jersey} `)}
              </span>
              {selectedPlayer.headshot ? (
                <Image
                  alt={selectedPlayer.headshot.alt ?? ''}
                  className="rounded-xl object-contain"
                  fill
                  quality={100}
                  src={selectedPlayer.headshot.href ?? ''}
                />
              ) : null}
            </div>
            <CardContent className="flex flex-col pt-4">
              <div className="flex w-full flex-row flex-nowrap items-center justify-between">
                <div>
                  <h2 className="line-clamp-1 border-0 !pb-0">
                    {selectedPlayer.displayName}
                  </h2>
                  <h6>{selectedPlayer.position.displayName}</h6>
                </div>
                <Button
                  onClick={() => {
                    onSelect(selectedPlayer);
                    setTeamContext([...teamContext, selectedPlayer]);
                  }}
                  size="sm"
                >
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
        ) : null}
        <Separator />
      </motion.div>
      <CardTitle
        className="flex cursor-pointer flex-row items-center gap-2 p-4"
        onClick={() => {
          if (expanded !== 'team') setExpanded('team');
          if (expanded === 'team' && selectedPlayer) setExpanded('player');
        }}
      >
        {teamRoster.isFetched ? (
          <Image
            alt={`${teamRoster.data?.team.abbreviation} Logo`}
            className="aspect-square h-10"
            height={40}
            quality={50}
            src={teamRoster.data?.team.logo ?? ''}
            width={40}
          />
        ) : null}
        {teamRoster.data?.team.displayName ?? 'Loading...'}{' '}
        <ChevronDownIcon
          className={cn(
            'tranistion-transform ml-auto h-5 w-5 text-muted-foreground duration-200',
            expanded === 'team' ? 'rotate-180' : 'rotate-0',
          )}
        />
      </CardTitle>
      <Separator />
      <motion.div
        animate={{ height: expanded === 'team' ? 'min-content' : 0 }}
        className="overflow-hidden"
        initial={{ height: 'min-content' }}
      >
        <CardContent className="space-y-2 p-6">
          <Accordion collapsible type="single">
            <AccordionItem value="offense">
              <AccordionTrigger className="font-semibold">
                Offense
              </AccordionTrigger>
              <AccordionContent>
                <div className="my-4 flex flex-row flex-wrap justify-center gap-1">
                  {teamRoster.data
                    ? teamRoster.data.athletes[0]?.items.map((player) => {
                        return (
                          <Player
                            key={player.id}
                            player={player}
                            setExpanded={setExpanded}
                            setSelectedPlayer={setSelectedPlayer}
                            teamRoster={teamRoster}
                          />
                        );
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
                        return (
                          <Player
                            key={player.id}
                            player={player}
                            setExpanded={setExpanded}
                            setSelectedPlayer={setSelectedPlayer}
                            teamRoster={teamRoster}
                          />
                        );
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
                        return (
                          <Player
                            key={player.id}
                            player={player}
                            setExpanded={setExpanded}
                            setSelectedPlayer={setSelectedPlayer}
                            teamRoster={teamRoster}
                          />
                        );
                      })
                    : null}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <Separator />
      </motion.div>
      <CardTitle
        className="flex cursor-pointer flex-row items-center gap-2 p-4"
        onClick={() => {
          if (expanded === 'yourTeam') {
            setExpanded('team');
          }
          if (expanded !== 'yourTeam') {
            setExpanded('yourTeam');
          }
        }}
      >
        <IconUsers className="h-10 w-10 p-2" />
        Your Team
        <ChevronDownIcon
          className={cn(
            'tranistion-transform ml-auto h-5 w-5 text-muted-foreground duration-200',
            expanded === 'yourTeam' ? 'rotate-180' : 'rotate-0',
          )}
        />
      </CardTitle>
      <motion.div
        animate={{ height: expanded === 'yourTeam' ? 'min-content' : 0 }}
        initial={{ height: 0 }}
      >
        <Separator />
        <CardContent className="p-6">
          <div className="flex flex-row flex-wrap justify-center gap-1">
            {teamContext.map((player) => {
              return (
                <Player
                  key={player.id}
                  player={player}
                  setExpanded={setExpanded}
                  setSelectedPlayer={setSelectedPlayer}
                  teamRoster={teamRoster}
                />
              );
            })}
          </div>
        </CardContent>
      </motion.div>
    </Card>
  );
}
function Player({
  player,
  teamRoster,
  setExpanded,
  setSelectedPlayer,
}: {
  player: Player;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is fine
  teamRoster: any;
  setExpanded: (value: SetStateAction<'player' | 'team' | 'yourTeam'>) => void;
  setSelectedPlayer: Dispatch<SetStateAction<Player | undefined>>;
}): React.ReactNode {
  const [cardExpanded, setCardExpanded] = useState<boolean>();
  const [hover, setHover] = useState<boolean>();

  useEffect(() => {
    if (hover) setCardExpanded(false);
  }, [hover]);
  useEffect(() => {
    if (!cardExpanded) setHover(false);
  }, [cardExpanded]);

  if (hover === true && cardExpanded === true) {
    setCardExpanded(false);
  }

  if (player.status.id !== '1' && player.status.id !== '13')
    return (
      <HoverCard
        closeDelay={0}
        onOpenChange={setCardExpanded}
        open={cardExpanded ? !hover : undefined}
        openDelay={30}
      >
        <HoverCardContent
          className="flex max-h-min w-max min-w-[20rem] cursor-default flex-row flex-nowrap gap-2"
          onMouseEnter={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
          onMouseOut={() => {
            setHover(false);
          }}
        >
          <Avatar className="inline-block h-12 w-auto">
            {player.headshot ? (
              <AvatarImage
                alt={player.headshot.alt ?? ''}
                asChild
                className="aspect-square object-cover"
                src={player.headshot.href ?? ''}
                style={{
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- this will exist
                  background: `#${teamRoster.data?.team.color}`,
                }}
              >
                <Image
                  alt={player.headshot.alt ?? ''}
                  height={48}
                  quality={100}
                  src={player.headshot.href ?? ''}
                  width={48}
                />
              </AvatarImage>
            ) : null}
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
        <HoverCardTrigger
          onMouseEnter={() => {
            setHover(false);
          }}
        >
          <Button
            className="h-min p-1"
            onClick={() => {
              setExpanded('player');
              setSelectedPlayer(player);
            }}
            size="sm"
            variant="outline"
          >
            <div className="flex aspect-square h-7 items-center justify-center">
              {player.headshot ? (
                <Image
                  alt={player.headshot.alt ?? ''}
                  className="rounded-sm object-cover"
                  height={28}
                  quality={25}
                  src={player.headshot.href ?? ''}
                  width={28}
                />
              ) : null}
            </div>
          </Button>
        </HoverCardTrigger>
      </HoverCard>
    );
}

export interface Player {
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
  headshot?: {
    href?: string;
    alt?: string;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is fine
  injuries: any[]; // You may want to specify the interface of injuries
  teams: {
    $ref: string;
  }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is fine too
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
