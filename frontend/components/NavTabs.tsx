// components/NavTabs.tsx

import React, { ReactNode } from "react";
import {
  FaClipboardList,
  FaPrescriptionBottleAlt,
  FaCamera,
  FaHeartbeat,
} from "react-icons/fa";

export type Tab = "form" | "prescription" | "vision";

interface NavTabsProps {
  currentTab: Tab;
  setTab: (t: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "form", label: "Form Input", icon: <FaClipboardList /> },
  { id: "prescription", label: "Prescription Image", icon: <FaPrescriptionBottleAlt /> },
  { id: "vision", label: "Symptom Photo", icon: <FaCamera /> },
];

export function NavTabs({ currentTab, setTab }: NavTabsProps) {
  return (
    <header className="w-full bg-primary py-8">
      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6">
        {/* Branding */}
        <div className="flex items-center space-x-3 mb-4 lg:mb-0">
          <FaHeartbeat className="text-white text-4xl" />
          <span className="text-white text-3xl font-bold">Healytics</span>
        </div>

        {/* Navigation Pills */}
        <nav>
          <ul className="flex space-x-4">
            {tabs.map(({ id, label, icon }) => (
              <li key={id}>
                <button
                  onClick={() => setTab(id)}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-full font-semibold transition-all duration-200 ${
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
        </nav>
      </div>
    </header>
  );
}