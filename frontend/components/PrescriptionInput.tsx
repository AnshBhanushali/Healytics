// components/PrescriptionInput.tsx

import React from 'react';
import axios from '../utils/api';
import type { PredictionResponse } from '../types';

export interface PrescriptionInputProps {
  onResult: (r: PredictionResponse) => void;
}

export function PrescriptionInput({ onResult }: PrescriptionInputProps) {
  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const form = new FormData();
    form.append('file', e.target.files[0]);
    const { data } = await axios.post<PredictionResponse>(
      '/predict/prescription',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    onResult(data);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <label className="block mb-2">Upload Prescription Image</label>
      <input type="file" accept="image/*" onChange={handle} />
    </div>
  );
}
