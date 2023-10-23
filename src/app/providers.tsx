"use client";

import { AnimatePresence } from "framer-motion";
import { createContext, type ReactNode } from "react";

export const team = createContext("This is the team context");

export default function Providers({ children }: { children: ReactNode }) {
  return <AnimatePresence>{children}</AnimatePresence>;
}
