"use client";

import { AnimatePresence } from "framer-motion";
import {
  createContext,
  useState,
  type ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import type { Player } from "./stages/player-select";

// export const team = createContext<Player[]>([]);
export const TeamContext = createContext<{
  team: Player[];
  setTeam: Dispatch<SetStateAction<Player[]>>;
}>({
  team: [],
  setTeam: () => {
    console.error("Something went wrong!");
  },
});

export default function Providers({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<Player[]>([]);

  return (
    <AnimatePresence>
      <TeamContext.Provider value={{ team, setTeam }}>
        {children}
      </TeamContext.Provider>
    </AnimatePresence>
  );
}
