"use client";

import { useEffect, useState } from "react";
import TeamSelection from "./stages/team-selection";

export default function Page() {
  // const teamRoster = api.espn.getTeamRoster.useQuery(
  //   { teamId: winningSegment?.id ?? "0" },
  //   {
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //     refetchOnReconnect: false,
  //     enabled: winningSegment?.id != "",
  //   },
  // );

  // const [context, setContext] = useState<{
  //   stage: "teamSelection" | "addToTeam" | "review";
  //   teamId?: number;
  // }>({ stage: "teamSelection" });
  const [stage, setStage] = useState<number>(1);
  const [wheelDisabled, setWheelDisabled] = useState<boolean>(false);
  useEffect(() => {
    setWheelDisabled(stage > 1);
  }, [stage]);

  return (
    <TeamSelection
      // onFinished={async (winner) => {
      //   await new Promise((resolve) => setTimeout(resolve, 1000));
      //   setContext({ stage: "addToTeam", teamId: parseInt(winner.id) });
      //   console.log("disabled2", context);
      // }}
      onFinished={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setStage(2);
        setWheelDisabled(true);
      }}
      // disabled={context.stage != "teamSelection"}
      disabled={wheelDisabled}
    />
  );
}
