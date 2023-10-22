"use client";

import type { Team } from "@/server/api/routers/espn";
import { api } from "@/trpc/react";
import { IconLoader } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { createRef, useEffect, useState } from "react";
import TeamWheel from "../_components/team-wheel";
import { cn } from "@/lib/utils";
import styles from "./team-selection.module.css";

export default function TeamSelection({
  onFinished,
  disabled,
}: {
  onFinished?: (arg0: Team) => void;
  disabled?: boolean;
}) {
  const teams = api.espn.getTeams.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const WheelRef = createRef<{
    spin: () => void;
    currentSegment: { team: Team };
  }>();
  const [currentSegment, setCurrentSegment] = useState(" ");
  if (teams.isFetched && teams.data)
    return (
      <motion.div
        initial={{
          width: "100%",
        }}
        animate={{
          width: !disabled ? "100%" : "25%",
        }}
        className={cn(
          "flex h-full w-full min-w-[320px] flex-col items-center justify-center",
          disabled && styles.noClickWheel,
        )}
      >
        <motion.div
          initial={{
            translateX: 0,
            translateY: 0,
            scale: 1,
          }}
          animate={{
            scale: !disabled ? 1 : 0.5,
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
            isOnlyOnce={false}
            size={300}
            gameWidth={620}
            upDuration={100}
            downDuration={1000}
            fontFamily="Arial"
            // ref={WheelRef}
          />
          <h1 className="mx-auto mt-6 min-h-[40px] w-max">{currentSegment}</h1>
        </motion.div>
      </motion.div>
    );
  return (
    <div className="flex h-full w-full flex-row items-center justify-center gap-2">
      <IconLoader className="inline-block animate-spin" /> Loading...
    </div>
  );
}
