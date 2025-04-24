// components/FormInput.tsx

import React, { useState } from "react";
import api from "../utils/api";
import type { PredictionResponse } from "../types";
import axios from "axios";
import { motion } from "framer-motion";
import { FaExclamationCircle, FaUserAlt, FaHeartbeat, FaTint, FaFish } from "react-icons/fa";

// Explicitly type the structure of validation errors from the API
interface ValidationErrorDetail {
  loc: Array<string | number>;
  msg: string;
  type: string;
}

interface ValidationErrorResponse {
  detail: ValidationErrorDetail[];
}

interface Props {
  onResult: (r: PredictionResponse) => void;
}

interface FormState {
  age: string;
  systolic_bp: string;
  diastolic_bp: string;
  cholesterol: string;
  family_history: boolean;
}

export default function FormInput({ onResult }: Props) {
  // Log the base API URL to verify environment variable
  console.log("API URL is:", process.env.NEXT_PUBLIC_API_URL);

  const [form, setForm] = useState<FormState>({
    age: "",
    systolic_bp: "",
    diastolic_bp: "",
    cholesterol: "",
    family_history: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { age, systolic_bp, diastolic_bp, cholesterol } = form;

    if (!age || !systolic_bp || !diastolic_bp || !cholesterol) {
      setError("Please complete all fields.");
      return;
    }

    const payload = {
      age: Number(age),
      systolic_bp: Number(systolic_bp),
      diastolic_bp: Number(diastolic_bp),
      cholesterol: Number(cholesterol),
      family_history: form.family_history,
    };

    try {
      const { data } = await api.post<PredictionResponse>('/predict/form', payload);
      onResult(data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        const data = err.response.data as ValidationErrorResponse;
        const detail = data.detail;
        const msg =
          Array.isArray(detail) && detail.length
            ? `${detail[0].loc.slice(-1)[0]}: ${detail[0].msg}`
            : 'Invalid input.';
        setError(msg);
      } else {
        setError('Unexpected error. Please try again.');
      }
    }
  };

  // Define input fields with their basic validation ranges
  const fields = [
    { name: 'age', label: 'Age', icon: <FaUserAlt className="text-teal-500" />, min: 0, max: 120 },
    { name: 'systolic_bp', label: 'Systolic BP', icon: <FaHeartbeat className="text-teal-500" />, min: 50, max: 250 },
    { name: 'diastolic_bp', label: 'Diastolic BP', icon: <FaHeartbeat className="text-blue-500" />, min: 30, max: 150 },
    { name: 'cholesterol', label: 'Cholesterol', icon: <FaTint className="text-blue-500" />, min: 50, max: 400 },
  ];

  // Animation variants for decorative bubbles
  const bubbleVariants = {
    initial: { y: '100%', opacity: 0.3 },
    animate: {
      y: '-100%',
      opacity: 0.8,
      transition: {
        duration: Math.random() * 5 + 5,
        repeat: Infinity,
        repeatType: 'loop' as const,
        ease: 'linear',
      },
    },
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      aria-label="Health Prediction Form"
      className="relative overflow-hidden"
    >
      {/* Decorative bubbles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/40 shadow-md"
          style={{
            width: Math.random() * 25 + 15,
            height: Math.random() * 25 + 15,
            left: `${Math.random() * 100}%`,
          }}
          variants={bubbleVariants}
          initial="initial"
          animate="animate"
        />
      ))}

      {/* Fish icon animation */}
      <motion.div
        className="absolute top-4 right-4 text-teal-500"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      >
        <FaFish className="text-3xl" />
      </motion.div>

      <h2 className="text-4xl font-extrabold text-teal-800 flex items-center gap-3 relative z-10">
        <FaFish className="text-teal-500 animate-bounce" />
        Health Check Waves 🌊
      </h2>

      {error && (
        <motion.div
          className="flex items-center gap-2 text-red-700 bg-red-100 p-4 rounded-lg border-2 border-red-300 relative z-10 shadow-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, type: 'spring' }}
          role="alert"
        >
          <FaExclamationCircle className="text-xl" />
          <span className="font-semibold">{error}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
        {fields.map(({ name, label, icon, min, max }) => (
          <div key={name}>
            <label className="flex items-center mb-2 text-teal-700 font-bold text-lg">
              {icon}
              <span className="ml-2">{label}</span>
            </label>
            <motion.input
              type="number"
              name={name}
              placeholder={`${min} – ${max}`}
              min={min}
              max={max}
              value={form[name as keyof FormState] as string}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gradient-to-r from-teal-400 to-blue-400 rounded-xl bg-white/90 focus:ring-4 focus:ring-teal-400 focus:border-teal-500 transition-all duration-300 text-gray-800 placeholder-gray-500 shadow-sm"
              aria-label={label}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 10px rgba(94, 234, 212, 0.5)' }}
              whileHover={{ borderColor: '#3B82F6' }}
            />
          </div>
        ))}

        <div className="sm:col-span-2 flex items-center space-x-3 mt-4">
          <motion.input
            type="checkbox"
            name="family_history"
            checked={form.family_history}
            onChange={handleChange}
            className="h-6 w-6 text-teal-600 rounded-xl border-2 border-teal-400 focus:ring-teal-400 bg-white/90"
            aria-label="Family History"
            whileHover={{ scale: 1.1, boxShadow: '0 0 8px rgba(94, 234, 212, 0.5)' }}
          />
          <label className="font-bold text-teal-700 text-lg">Family History</label>
        </div>
      </div>

      <motion.button
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300 border-2 border-teal-300 relative z-10"
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(94, 234, 212, 0.7)' }}
        whileTap={{ scale: 0.95 }}
        aria-label="Submit Form"
      >
        Predict Risk! 🐠✨
      </motion.button>
    </motion.form>
  );
}