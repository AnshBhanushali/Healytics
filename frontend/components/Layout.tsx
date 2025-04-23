// components/Layout.tsx

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { NavTabs, Tab } from "./NavTabs";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const tab = (router.query.tab as Tab) || "form";

  const handleTab = (t: Tab) =>
    router.push(`/?tab=${t}`, undefined, { shallow: true });

  return (
    <div className="max-w-4xl mx-auto px-4">

      <AnimatePresence mode="wait">
        <motion.div
          key={router.asPath}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-8 mt-8"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
