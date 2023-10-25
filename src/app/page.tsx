'use client';

import { useEffect, useState } from 'react';
import type { Team } from '@/server/api/routers/espn';
import { PlayerSelect } from './stages/player-select';
import { TeamSelection } from './stages/team-selection';

export default function Page(): React.ReactNode {
  const [stage, setStage] = useState<number>(1);
  const [wheelDisabled, setWheelDisabled] = useState<boolean>(false);
  useEffect(() => {
    setWheelDisabled(stage > 1);
  }, [stage]);
  const [team, setTeam] = useState<Team>();

  return (
    <div className="flex h-full flex-row flex-nowrap">
      <TeamSelection
        disabled={wheelDisabled}
        onFinished={async (winner) => {
          setTeam(winner);
          setWheelDisabled(true);
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
          setStage(2);
        }}
        stage={stage}
      />
      <div className="flex h-full w-full flex-shrink items-center">
        {team ? (
          <PlayerSelect
            onSelect={() => {
              setStage(1);
              setWheelDisabled(false);
            }}
            team={team}
          />
        ) : null}
      </div>
    </div>
  );
}
