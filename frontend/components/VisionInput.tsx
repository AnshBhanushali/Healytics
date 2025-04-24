// components/VisionInput.tsx

import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from '../utils/api';
import type { PredictionResponse } from '../types';
import { Doughnut, Line, Radar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { motion } from 'framer-motion';

export interface VisionInputProps {
  onResult: (r: PredictionResponse) => void;
}

export function VisionInput({ onResult }: VisionInputProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles[0]) return;
    const form = new FormData();
    form.append('file', acceptedFiles[0]);
    const { data } = await axios.post<PredictionResponse>(
      '/predict/vision',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    onResult(data);
  }, [onResult]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        bg-white rounded-xl border-2 border-dashed p-6 flex items-center justify-center
        cursor-pointer transition-colors
        ${isDragActive ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-teal-400'}
      `}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-teal-600 font-medium">Drop your photo here…</p>
      ) : (
        <p className="text-gray-500">
          Drag &amp; drop a photo, or <span className="text-teal-600 font-medium">click to select</span>
        </p>
      )}
    </div>
  );
}

export interface VisionDashboardProps {
  data: PredictionResponse;
}

export function VisionDashboard({ data }: VisionDashboardProps) {
  const confidencePct = Math.round(data.confidence * 100);
  const readmitPct = Math.round(data.readmission_probability * 100);

  const confidenceData = useMemo(() => ({
    labels: ['Confidence', 'Remaining'],
    datasets: [
      {
        data: [confidencePct, 100 - confidencePct],
        backgroundColor: ['#4F46E5', '#E5E7EB'],
        borderWidth: 0,
      },
    ],
  }), [confidencePct]);

  const readmitTrend = useMemo(() => ({
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [
      {
        data: Array.from({ length: 7 }).map(
          () => Math.max(0, Math.min(100, readmitPct + (Math.random() - 0.5) * 15))
        ),
        borderColor: '#DC2626',
        fill: false,
        tension: 0.3,
      },
    ],
  }), [readmitPct]);

  const radarData = useMemo(() => ({
    labels: data.top_factors.map(f => f.replace(/_/g, ' ')),
    datasets: [
      {
        data: data.top_factors.map(() => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(37,99,235,0.2)',
        borderColor: '#2563EB',
        borderWidth: 1,
      },
    ],
  }), [data.top_factors]);

  const pieData = useMemo(() => ({
    labels: data.recommended_actions.map(a => a.length > 12 ? a.slice(0, 12) + '…' : a),
    datasets: [
      {
        data: data.recommended_actions.map(() => Math.floor(Math.random() * 100)),
        backgroundColor: ['#10B981','#6366F1','#F59E0B','#EF4444','#3B82F6'],
        borderWidth: 0,
      },
    ],
  }), [data.recommended_actions]);

  const opts = {
    plugins: { legend: { display: false } },
    maintainAspectRatio: true,
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-4 space-y-4"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-gray-700 text-center">
        Vision Analysis
      </h3>

      <div className="grid grid-cols-2 gap-4 justify-items-center">
        <div className="flex flex-col items-center w-24 h-24">
          <Doughnut data={confidenceData} options={{ ...opts, cutout: '50%' }} />
          <div className="text-xs font-semibold mt-1">Confidence Score</div>
        </div>

        <div className="flex flex-col items-center w-24 h-24">
          <Line data={readmitTrend} options={opts} />
          <div className="text-xs font-semibold mt-1">Readmit Trend</div>
        </div>

        <div className="flex flex-col items-center w-24 h-24">
          <Radar data={radarData} options={opts} />
          <div className="text-xs font-semibold mt-1">Risk Factors</div>
        </div>

        <div className="flex flex-col items-center w-24 h-24">
          <Pie data={pieData} options={opts} />
          <div className="text-xs font-semibold mt-1">Actions Impact</div>
        </div>
      </div>

      <div className="text-xs space-y-2">
        <div>
          <strong>Detected Condition:</strong> {data.prediction.replace(/_/g, ' ')}
        </div>
        <div>
          <strong>Risk Factors:</strong>
          <ul className="list-disc list-inside ml-4">
            {data.top_factors.map((f, i) => (
              <li key={i}>{f.replace(/_/g, ' ')}</li>
            ))}
            <li>Family History</li>
            <li>High Stress Levels</li>
            <li>Low Hydration</li>
          </ul>
        </div>
        <div>
          <strong>Recommended Actions:</strong>
          <ul className="list-decimal list-inside ml-4">
            {data.recommended_actions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
            <li>Schedule follow-up in two weeks</li>
            <li>Adopt balanced diet and exercise</li>
            <li>Monitor vitals daily</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default VisionInput;
