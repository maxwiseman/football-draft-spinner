"use client";

import { api } from "@/trpc/react";
import { IconLoader } from "@tabler/icons-react";
import { createRef, useEffect, useState } from "react";
import TeamWheelComponent from "./_components/teamWheel";
import type { Team } from "@/server/api/routers/espn";

export default function Page() {
  const WheelRef = createRef<{ spin: () => void; currentSegment: string }>();
  const [currentSegment, setCurrentSegment] = useState(" ");
  const [winningSegment, setWinningSegment] = useState<Team>();
  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        if (WheelRef.current) {
          WheelRef.current.spin();
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- This should only run once
  }, []);
  const teams = api.espn.getTeams.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const teamRoster = api.espn.getTeamRoster.useQuery(
    { teamId: winningSegment?.id ?? "0" },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      enabled: winningSegment?.id != "",
    },
  );

  return (
    <div className="m-auto flex h-screen min-h-max w-min flex-col justify-center">
      {!teams.isLoading && teams.data ? (
        <TeamWheelComponent
          teams={teams.data}
          // winningSegment="Team G"
          onFinished={async (winner) => {
            setWinningSegment(winner);
            console.log("winningId", winningSegment?.id);
            await teamRoster.refetch();
          }}
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
          ref={WheelRef}
        />
      ) : (
        <div className="flex h-screen flex-row items-center gap-2">
          <IconLoader className="inline-block animate-spin" /> Loading...
        </div>
      )}
      <h1 className="mx-auto mt-6 w-max">{currentSegment}</h1>
    </div>
  );
}
