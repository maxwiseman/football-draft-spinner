"use client";

import { AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <AnimatePresence>{children}</AnimatePresence>;
}
