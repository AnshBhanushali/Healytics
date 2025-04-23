// components/RiskDashboard.tsx

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import type { PredictionResponse } from '../types';
import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

interface Props {
  data: PredictionResponse;
}

export const RiskDashboard: React.FC<Props> = ({ data }) => {
  const riskPercent = Math.round(data.confidence * 100);
  const readmitPercent = Math.round(data.readmission_probability * 100);

  const riskData = {
    labels: ['Risk', 'Remaining'],
    datasets: [
      {
        data: [riskPercent, 100 - riskPercent],
        backgroundColor: ['#6366F1', '#E5E7EB'],
        borderWidth: 0,
      },
    ],
  };

  const readmitData = {
    labels: ['Readmit', 'No Readmit'],
    datasets: [
      {
        data: [readmitPercent, 100 - readmitPercent],
        backgroundColor: ['#10B981', '#F3F4F6'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold text-gray-700">Risk Analysis</h3>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        <div className="w-40">
          <Doughnut data={riskData} options={{
            cutout: '70%',
            plugins: { legend: { display: false } },
          }} />
          <div className="text-center mt-2 font-bold text-gray-800">
            {riskPercent}%
            <div className="text-sm text-gray-500">Risk Score</div>
          </div>
        </div>

        <div className="w-40">
          <Doughnut data={readmitData} options={{
            cutout: '70%',
            plugins: { legend: { display: false } },
          }} />
          <div className="text-center mt-2 font-bold text-gray-800">
            {readmitPercent}%
            <div className="text-sm text-gray-500">Readmission Prob.</div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-700">Top Factors</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          {data.top_factors.map((f, i) => (
            <li key={i}>{f.replace("_", " ")}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-gray-700">Recommendations</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          {data.recommended_actions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>

      <div className="flex items-center text-yellow-600 space-x-2">
        <FaExclamationTriangle />
        <span className="font-medium">Urgency: {data.urgency}</span>
      </div>
    </motion.div>
  );
};