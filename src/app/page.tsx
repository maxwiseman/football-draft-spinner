"use client";

import { api } from "@/trpc/react";
import { IconLoader } from "@tabler/icons-react";
import { createRef, useEffect, useState } from "react";
import TeamWheelComponent from "./_components/teamWheel";

export default function Page() {
  const WheelRef = createRef<{ spin: () => void; currentSegment: string }>();
  const [currentSegment, setCurrentSegment] = useState("");
  const segColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
    "#EE4040",
  ];
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
  const teams = api.espn.getTeams.useQuery();

  return (
    <div className="m-auto w-min">
      {!teams.isLoading && teams.data ? (
        <TeamWheelComponent
          segments={teams.data}
          segColors={segColors}
          // winningSegment="Team G"
          onFinished={(winner) => {
            console.log(winner.team);
          }}
          onSegmentChange={(segment) => {
            setCurrentSegment(segment.team.displayName);
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
      <h1 className="mx-auto mt-4 w-max">{currentSegment}</h1>
    </div>
  );
}
