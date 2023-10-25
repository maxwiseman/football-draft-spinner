"use client";

import { cn } from "@/lib/utils";
import type { Team } from "@/server/api/routers/espn";
import { api } from "@/trpc/react";
import { IconLoader } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";
import TeamWheel from "../_components/team-wheel";

export default function TeamSelection({
  onFinished,
  disabled,
  stage,
}: {
  onFinished?: (arg0: Team) => void;
  disabled?: boolean;
  stage?: number;
}) {
  const shrunk: boolean = stage !== 1;
  const teams = api.espn.getTeams.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  // const WheelRef = createRef<{
  //   spin: () => void;
  //   currentSegment: { team: Team };
  // }>();
  const [currentSegment, setCurrentSegment] = useState(" ");
  if (teams.isFetched && teams.data)
    return (
      <motion.div
        initial={{
          width: "100%",
        }}
        animate={{
          width: !shrunk ? "100%" : "25%",
        }}
        className={cn(
          "flex h-full w-full min-w-[320px] flex-shrink-0 flex-col items-center justify-center",
        )}
      >
        <motion.div
          initial={{
            translateX: 0,
            translateY: 0,
            scale: 1,
          }}
          animate={{
            scale: !shrunk ? 1 : 0.5,
          }}
        >
          <TeamWheel
            teams={teams.data}
            // winningSegment="Team G"
            onFinished={onFinished}
            onTeamChange={(team) => {
              setCurrentSegment(team.displayName);
            }}
            primaryColor="black"
            contrastColor="white"
            buttonText="Spin"
            size={300}
            gameWidth={620}
            upDuration={100}
            downDuration={1000}
            fontFamily="Arial"
            disabled={disabled}
            // ref={WheelRef}
          />
          <h1 className="mx-auto mt-6 min-h-[40px] w-max">{currentSegment}</h1>
        </motion.div>
      </motion.div>
    );
  return (
    <div className="flex h-full w-full flex-shrink-0 flex-row items-center justify-center gap-2">
      <IconLoader className="inline-block animate-spin" /> Loading...
    </div>
  );
}
