"use client";

import { createRef, useEffect, useState } from "react";
import WheelComponent from "./_components/wheel";

export default function Page() {
  const WheelRef = createRef<{ spin: () => void; currentSegment: string }>();
  const [currentSegment, setCurrentSegment] = useState("");
  const segments = [
    "Arizona Cardinals",
    "Atlanta Falcon",
    "Batlimore Ravens",
    "Buffalo Bills",
    "Carolina Panthers",
    "Chicago Bears",
    "Cincinnati Bengals",
    "Clevland Browns",
    "Dallas Cowboys",
    "Denver Broncos",
    "Detroit Lions",
    "Green Bay Packers",
    "Houston Texans",
    "Indianapolis Colts",
    "Jacksonville Jaguars",
    "Kansas City Chiefs",
    "Las Vegas Raiders",
    "Los Angeles Chargers",
    "Los Angeles Rams",
    "Miami Dolphins",
    "Minnesota Vikings",
    "New England Patriots",
    "New Orleans Saints",
    "New York Giants",
    "New York Jets",
    "Philadelphia Eagles",
    "Pittsburgh Steelers",
    "San Francisco 49ers",
    "Seattle Seahawks",
    "Tampa Bay Buccaneers",
    "Tennessee Titans",
    "Washington Commanders",
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
      <h1 className="mx-auto mt-4 w-max">{currentSegment}</h1>
    </div>
  );
}
