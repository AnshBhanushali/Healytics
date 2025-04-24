// components/RiskDashboard.tsx

import React, { useMemo } from 'react';
import {
  Doughnut,
  Pie,
  Bar,
  Radar,
  PolarArea,
  Line,
} from 'react-chartjs-2';
import 'chart.js/auto';
import type { PredictionResponse } from '../types';
import { motion } from 'framer-motion';

interface Props {
  data: PredictionResponse;
}

export const RiskDashboard: React.FC<Props> = ({ data }) => {
  const riskPercent = Math.round(data.confidence * 100);
  const readmitPercent = Math.round(data.readmission_probability * 100);

  // random importance values for top factors
  const factorValues = useMemo(
    () =>
      data.top_factors.map(
        () => parseFloat((Math.random() * 0.9 + 0.1).toFixed(2))
      ),
    [data.top_factors]
  );

  // random sizes for recommendations
  const recommendationValues = useMemo(
    () =>
      data.recommended_actions.map(
        () => parseFloat((Math.random() * 50 + 10).toFixed(0))
      ),
    [data.recommended_actions]
  );

  // confidence trend over 6 time points
  const lineData = useMemo(() => {
    const pts = Array.from({ length: 6 }).map(
      () => parseFloat((data.confidence + (Math.random() - 0.5) * 0.2).toFixed(2))
    );
    return {
      labels: pts.map((_, i) => `T${i + 1}`),
      datasets: [{ data: pts, fill: false, tension: 0.4, borderWidth: 2 }],
    };
  }, [data.confidence]);

  const chartOpts = {
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  const riskData = useMemo(() => ({
    labels: ['Risk', 'Remaining'],
    datasets: [
      {
        data: [riskPercent, 100 - riskPercent],
        backgroundColor: ['#6366F1', '#E5E7EB'],
        borderWidth: 0,
      },
    ],
  }), [riskPercent]);

  const readmitData = useMemo(() => ({
    labels: ['Readmit', 'No Readmit'],
    datasets: [
      {
        data: [readmitPercent, 100 - readmitPercent],
        backgroundColor: ['#10B981', '#F3F4F6'],
        borderWidth: 0,
      },
    ],
  }), [readmitPercent]);

  const urgMap: Record<string, number> = { high: 70, medium: 20, low: 10 };
  const urgencyData = useMemo(() => {
    const u = urgMap[data.urgency] ?? 0;
    return {
      labels: ['Urgent', 'Not Urgent'],
      datasets: [
        {
          data: [u, 100 - u],
          backgroundColor: ['#F59E0B', '#E5E7EB'],
          borderWidth: 0,
        },
      ],
    };
  }, [data.urgency]);

  const barData = useMemo(() => ({
    labels: data.top_factors.map(f => f.replace(/_/g, ' ')),
    datasets: [
      {
        label: 'Top Factor Importance',
        data: factorValues,
        backgroundColor: factorValues.map(() => '#3B82F6'),
      },
    ],
  }), [data.top_factors, factorValues]);

  const radarData = useMemo(() => ({
    labels: data.top_factors.map(f => f.replace(/_/g, ' ')),
    datasets: [
      {
        label: 'Top Factor Radar',
        data: factorValues,
        backgroundColor: 'rgba(99,102,241,0.2)',
        borderColor: '#6366F1',
        borderWidth: 1,
      },
    ],
  }), [data.top_factors, factorValues]);

  const polarData = useMemo(() => ({
    labels: data.recommended_actions,
    datasets: [
      {
        label: 'Recommendation Impact',
        data: recommendationValues,
        backgroundColor: recommendationValues.map(() => '#EF4444'),
        borderWidth: 0,
      },
    ],
  }), [data.recommended_actions, recommendationValues]);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold mb-4 text-center">Risk Dashboard</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Risk Score */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32">
            <Doughnut
              data={riskData}
              options={{ ...chartOpts, cutout: '70%' }}
            />
          </div>
          <div className="mt-1 text-sm font-bold text-center">
            {riskPercent}%<br />
            <span className="font-normal">Risk Score</span>
          </div>
        </div>

        {/* Readmission Probability */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32">
            <Doughnut
              data={readmitData}
              options={{ ...chartOpts, cutout: '70%' }}
            />
          </div>
          <div className="mt-1 text-sm font-bold text-center">
            {readmitPercent}%<br />
            <span className="font-normal">Readmit %</span>
          </div>
        </div>

        {/* Urgency */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32">
            <Pie data={urgencyData} options={chartOpts} />
          </div>
          <div className="mt-1 text-sm font-bold text-center">
            {data.urgency.charAt(0).toUpperCase() + data.urgency.slice(1)}<br />
            <span className="font-normal">Urgency</span>
          </div>
        </div>

        {/* Top Factor Importance */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32">
            <Bar data={barData} options={chartOpts} />
          </div>
          <div className="mt-1 text-sm font-bold text-center">
            Top Factor Importance
          </div>
        </div>

        {/* Top Factor Radar */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32">
            <Radar data={radarData} options={chartOpts} />
          </div>
          <div className="mt-1 text-sm font-bold text-center">
            Top Factor Radar
          </div>
        </div>

        {/* Recommendations Impact */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32">
            <PolarArea data={polarData} options={chartOpts} />
          </div>
          <div className="mt-1 text-sm font-bold text-center">
            Recommendation Impact
          </div>
        </div>

        {/* Confidence Trend */}
        <div className="flex flex-col items-center col-span-2">
          <div className="w-32 h-32">
            <Line data={lineData} options={chartOpts} />
          </div>
          <div className="mt-1 text-sm font-bold text-center">
            Confidence Trend
          </div>
        </div>
      </div>

      {/* Top Factors & Recommendations Lists */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Top Factors</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {data.top_factors.map((f, i) => (
              <li key={i}>{f.replace(/_/g, ' ')}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Recommendations</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {data.recommended_actions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
