import { useState } from "react";
import { NavTabs } from "../components/NavTabs";
import { FormInput } from "../components/FormInput";
import { PrescriptionInput } from "../components/PrescriptionInput";
import { VisionInput } from "../components/VisionInput";
import { RiskDashboard } from "../components/RiskDashboard";
import { PredictionResponse } from "../types";

export default function Home() {
  const [tab, setTab] = useState<"form"|"prescription"|"vision">("form");
  const [result, setResult] = useState<PredictionResponse|null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <NavTabs currentTab={tab} setTab={setTab} />

      <div className="flex flex-1 p-6 space-x-6">
        <div className="w-1/2">
          {tab === "form" && <FormInput onResult={setResult} />}
          {tab === "prescription" && <PrescriptionInput onResult={setResult} />}
          {tab === "vision" && <VisionInput onResult={setResult} />}
        </div>

        <div className="w-1/2">
          {result ? (
            <RiskDashboard data={result} />
          ) : (
            <div className="p-4 text-gray-500 italic">
              Submit data in the left panel to see results here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
