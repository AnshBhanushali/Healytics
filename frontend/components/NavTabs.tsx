// components/NavTabs.tsx

import React, { ReactNode } from "react";
import { FaClipboardList, FaCamera, FaHeartbeat } from "react-icons/fa";

export type Tab = "form" | "prescription" | "vision";

interface NavTabsProps {
  currentTab: Tab;
  setTab: (t: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "form",         label: "Form Input",         icon: <FaClipboardList /> },
  { id: "vision",       label: "Symptom Photo",      icon: <FaCamera /> },
];

export function NavTabs({ currentTab, setTab }: NavTabsProps) {
  return (
    <nav className="bg-primary py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-6">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-2">
          <FaHeartbeat className="text-white text-3xl" />
          <span className="text-white text-2xl font-bold">Healytics</span>
        </div>

        {/* Navigation Pills */}
        <ul className="flex space-x-4">
          {tabs.map(({ id, label, icon }) => (
            <li key={id}>
              <button
                onClick={() => setTab(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
                  currentTab === id
                    ? "bg-white text-primary shadow-lg"
                    : "text-white hover:bg-white/[0.2]"
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
