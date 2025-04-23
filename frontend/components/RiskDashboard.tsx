// components/RiskDashboard.tsx
import "chart.js/auto"; // auto-register scales, controllers, elements & plugins
import { Bar } from "react-chartjs-2";
import type { PredictionResponse } from "../types";
import { motion } from "framer-motion";

interface Props {
  data: PredictionResponse;
}

export const RiskDashboard = ({ data }: Props) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-primary">
        Risk Score: {data.confidence}
      </h2>
      <div className="text-sm uppercase text-secondary font-semibold">
        Category: {data.prediction.replace("_", " ")}
      </div>

      <Bar
        data={{
          labels: data.top_factors,
          datasets: [{ label: "Factors", data: [1, 1] }],
        }}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
        }}
      />

      <p className="italic text-gray-600">{data.description}</p>

      <div>
        <h3 className="font-semibold">Recommendations</h3>
        <ul className="list-disc list-inside text-gray-700">
          {data.recommended_actions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>

      <div className="text-sm text-gray-600">
        <strong>Readmission:</strong>{" "}
        {data.hospital_readmission ? "Consider" : "Not needed"} (prob{" "}
        {data.readmission_probability})
      </div>
    </motion.div>
  );
};
