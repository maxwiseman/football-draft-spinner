"use client";

import { createRef, useEffect, useState } from "react";
import WheelComponent from "./_components/wheel";

export default function Page() {
  const WheelRef = createRef<{ spin: () => void; currentSegment: string }>();
  const [currentSegment, setCurrentSegment] = useState("");
  const segments = [
    "Team A",
    "Team B",
    "Team C",
    "Team D",
    "Team E",
    "Team F",
    "Team G",
    "Team H",
  ];
  const segColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
  ];
  const onFinished = (winner: string) => {
    console.log(winner);
  };
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

  return (
    <div className="m-auto w-min">
      <WheelComponent
        segments={segments}
        segColors={segColors}
        // winningSegment="Team G"
        onFinished={onFinished}
        onSegmentChange={(segment) => {
          setCurrentSegment(segment);
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
      <p>{currentSegment}</p>
    </div>
  );
}
