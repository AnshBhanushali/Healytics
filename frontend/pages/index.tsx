// pages/index.tsx

import React, { useState, useCallback } from "react";
import { NavTabs } from "../components/NavTabs";
import FormInput from "../components/FormInput";
import { PrescriptionInput}  from "../components/PrescriptionInput";
import { VisionInput } from "../components/VisionInput";
import { RiskDashboard } from "../components/RiskDashboard";
import type { PredictionResponse } from "../types";
import { motion } from "framer-motion";

export default function Home() {
  const [tab, setTab] = useState<"form" | "prescription" | "vision">("form");
  const [result, setResult] = useState<PredictionResponse | null>(null);

  // Whenever the user switches tabs, clear out any existing result
  const handleTabChange = useCallback(
    (newTab: "form" | "prescription" | "vision") => {
      setResult(null);
      setTab(newTab);
    },
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* pass our wrapped setter here instead of setTab directly */}
      <NavTabs currentTab={tab} setTab={handleTabChange} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          className="flex flex-col lg:flex-row gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Input Section */}
          <motion.div
            className="w-full lg:w-1/2 bg-white rounded-2xl shadow-lg p-6 border-4 border-gradient-to-r from-cyan-400 via-pink-400 to-purple-400"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {tab === "form" && <FormInput onResult={setResult} />}
            {tab === "prescription" && <PrescriptionInput onResult={setResult} />}
            {tab === "vision" && <VisionInput onResult={setResult} />}
          </motion.div>

          {/* Result Section */}
          <motion.div
            className="w-full lg:w-1/2 bg-white rounded-2xl shadow-lg p-6 border-4 border-gradient-to-r from-cyan-400 via-pink-400 to-purple-400"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {result ? (
              <RiskDashboard data={result} />
            ) : (
              <div className="text-center text-gray-500 italic p-6">
                Submit data in the panel below to see results here.
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
