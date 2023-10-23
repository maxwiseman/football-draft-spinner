"use client";

import type { Team } from "@/server/api/routers/espn";
import { useEffect, useState } from "react";
import PlayerSelect from "./stages/player-select";
import TeamSelection from "./stages/team-selection";

export default function Page() {
  // const [context, setContext] = useState<{
  //   stage: "teamSelection" | "addToTeam" | "review";
  //   teamId?: number;
  // }>({ stage: "teamSelection" });
  const [stage, setStage] = useState<number>(1);
  const [wheelDisabled, setWheelDisabled] = useState<boolean>(false);
  useEffect(() => {
    setWheelDisabled(stage > 1);
  }, [stage]);
  const [team, setTeam] = useState<Team>();

  return (
    <div className="flex h-full flex-row flex-nowrap">
      <TeamSelection
        // onFinished={async (winner) => {
        //   await new Promise((resolve) => setTimeout(resolve, 1000));
        //   setContext({ stage: "addToTeam", teamId: parseInt(winner.id) });
        //   console.log("disabled2", context);
        // }}
        onFinished={async (winner) => {
          setTeam(winner);
          setWheelDisabled(true);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setStage(2);
        }}
        // disabled={context.stage != "teamSelection"}
        disabled={wheelDisabled}
        stage={stage}
      />
      <div className="flex h-full w-full flex-shrink items-center">
        {team ? <PlayerSelect team={team} /> : null}
      </div>
    </div>
  );
}
