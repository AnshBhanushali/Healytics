import React, { useState } from "react";
import api from "../utils/api";
import type { PredictionResponse } from "../types";
import axios from "axios";
import { motion } from "framer-motion";
import { FaExclamationCircle, FaUserAlt, FaHeartbeat, FaTint } from "react-icons/fa";

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
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.age || !form.systolic_bp || !form.diastolic_bp || !form.cholesterol) {
      setError("All fields are required.");
      return;
    }
    const payload = {
      age: Number(form.age),
      systolic_bp: Number(form.systolic_bp),
      diastolic_bp: Number(form.diastolic_bp),
      cholesterol: Number(form.cholesterol),
      family_history: form.family_history,
    };
    try {
      const { data } = await api.post<PredictionResponse>("/predict/form", payload);
      onResult(data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        setError("Server validation failed. Please check your inputs.");
      } else {
        setError("Unexpected error. Try again.");
      }
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-r from-pink-200 via-yellow-100 to-cyan-200 p-4 rounded-3xl max-w-lg mx-auto shadow-2xl border-4 border-purple-400"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
    >
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl p-8 space-y-6 shadow-lg"
        aria-label="Health Prediction Form"
      >
        <h2 className="text-3xl font-extrabold text-purple-600 flex items-center gap-3">
          <FaHeartbeat className="text-red-500 animate-pulse" />
          Health Check Vibes
        </h2>

        {error && (
          <motion.div
            className="flex items-center gap-2 bg-red-500 text-white p-4 rounded-lg shadow-md border-2 border-red-700"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, type: "spring" }}
            role="alert"
          >
            <FaExclamationCircle className="text-xl" />
            <span className="font-semibold">{error}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { name: "age", label: "Age", placeholder: "e.g. 30", icon: <FaUserAlt className="text-blue-500" /> },
            { name: "cholesterol", label: "Cholesterol", placeholder: "e.g. 180", icon: <FaTint className="text-green-500" /> },
            { name: "systolic_bp", label: "Systolic BP", placeholder: "e.g. 120", icon: <FaTint className="text-pink-500" /> },
            { name: "diastolic_bp", label: "Diastolic BP", placeholder: "e.g. 80", icon: <FaTint className="text-yellow-500" /> },
          ].map(({ name, label, placeholder, icon }) => (
            <div key={name} className="flex flex-col">
              <label className="flex items-center gap-2 text-lg font-bold text-purple-700 mb-2">
                {icon}
                {label}
              </label>
              <motion.input
                type="number"
                name={name}
                value={(form as any)[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full p-3 border-2 border-purple-300 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-500 transition-all duration-300 text-gray-800 placeholder-gray-500"
                aria-label={label}
                whileFocus={{ scale: 1.02 }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <motion.input
            type="checkbox"
            name="family_history"
            checked={form.family_history}
            onChange={handleChange}
            className="h-6 w-6 text-purple-600 rounded-xl border-2 border-purple-400 focus:ring-purple-400"
            aria-label="Family History"
            whileHover={{ scale: 1.1 }}
          />
          <label className="text-lg font-semibold text-purple-700">
            Family history of disease
          </label>
        </div>

        <motion.button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold text-lg rounded-xl shadow-lg hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition-all duration-300 border-2 border-purple-300"
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(236, 72, 153, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          aria-label="Submit Form"
        >
          Predict Risk! 🚀
        </motion.button>
      </form>
    </motion.div>
  );
}