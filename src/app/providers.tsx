"use client";

import { AnimatePresence } from "framer-motion";
import {
  createContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { Player } from "./stages/player-select";

export const TeamContext = createContext<{
  team: Player[];
  setTeam: Dispatch<SetStateAction<Player[]>>;
}>({
  team: [],
  setTeam: () => {
    console.error("Something went wrong!");
  },
});

export function Providers({
  children,
}: {
  children: ReactNode;
}): React.ReactNode {
  const [team, setTeam] = useState<Player[]>([]);

  return (
    <AnimatePresence>
      <TeamContext.Provider value={{ team, setTeam }}>
        {children}
      </TeamContext.Provider>
    </AnimatePresence>
  );
}
