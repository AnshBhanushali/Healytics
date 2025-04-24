// components/FormInput.tsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaExclamationCircle,
  FaUserAlt,
  FaHeartbeat,
  FaTint,
  FaFish,
} from "react-icons/fa";
import type { PredictionResponse } from "../types";

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
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Calculate a simple weighted risk score with jitter
  function calculateRiskScore(vals: {
    age: number;
    systolic_bp: number;
    diastolic_bp: number;
    cholesterol: number;
    family_history: boolean;
  }) {
    let score =
      (vals.age / 120) * 0.2 +
      (vals.systolic_bp / 200) * 0.3 +
      (vals.diastolic_bp / 120) * 0.2 +
      (vals.cholesterol / 300) * 0.2 +
      (vals.family_history ? 0.1 : 0);
    score += (Math.random() - 0.5) * 0.1;
    return Math.min(1, Math.max(0, score));
  }

  function categorize(score: number): PredictionResponse["prediction"] {
    if (score > 0.85) return "very_high_risk";
    if (score > 0.6) return "high_risk";
    if (score > 0.35) return "medium_risk";
    return "low_risk";
  }

  function generateTopFactors(vals: {
    age: number;
    systolic_bp: number;
    diastolic_bp: number;
    cholesterol: number;
    family_history: boolean;
  }) {
    const factors: string[] = [];
    if (vals.age >= 65) factors.push("advanced_age");
    if (vals.systolic_bp >= 140) factors.push("high_systolic_bp");
    if (vals.diastolic_bp >= 90) factors.push("high_diastolic_bp");
    if (vals.cholesterol >= 240) factors.push("high_cholesterol");
    if (vals.family_history) factors.push("family_history");

    const extras = ["elevated_heart_rate", "low_hydration", "elevated_stress_level"];
    const shuffled = extras.sort(() => Math.random() - 0.5);
    factors.push(...shuffled.slice(0, Math.floor(Math.random() * 3)));
    return factors;
  }

  function generateRecommendations(factors: string[]) {
    const map: Record<string, string> = {
      advanced_age: "Schedule a geriatric wellness check‐up",
      high_systolic_bp: "Reduce salt intake & monitor BP daily",
      high_diastolic_bp: "Try relaxation exercises & recheck",
      high_cholesterol: "Adopt a low‐fat diet and exercise plan",
      family_history: "Discuss genetic risks with your doctor",
      elevated_heart_rate: "Practice deep‐breathing or meditation",
      low_hydration: "Increase water intake to at least 2L/day",
      elevated_stress_level: "Try stress‐management like yoga",
    };
    return factors.map((f) => map[f] || `Review ${f}`);
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // parse & validate
    const age = Number(form.age),
      systolic_bp = Number(form.systolic_bp),
      diastolic_bp = Number(form.diastolic_bp),
      cholesterol = Number(form.cholesterol);
    if (
      isNaN(age) ||
      isNaN(systolic_bp) ||
      isNaN(diastolic_bp) ||
      isNaN(cholesterol) ||
      !age ||
      !systolic_bp ||
      !diastolic_bp ||
      !cholesterol
    ) {
      setError("Please fill in all fields with valid numbers.");
      return;
    }

    // compute
    const score = calculateRiskScore({
      age,
      systolic_bp,
      diastolic_bp,
      cholesterol,
      family_history: form.family_history,
    });
    const prediction = categorize(score);
    const top_factors = generateTopFactors({
      age,
      systolic_bp,
      diastolic_bp,
      cholesterol,
      family_history: form.family_history,
    });
    const recommended_actions = generateRecommendations(top_factors);
    const confidence = parseFloat(score.toFixed(2));
    const readmission_probability = confidence;
    const urgency = confidence > 0.8 ? "high" : confidence > 0.5 ? "medium" : "low";
    const hospital_readmission = confidence > 0.5;
    const description = `Form simulation: ${prediction.replace(
      "_",
      " "
    )} (readmit ${Math.round(readmission_probability * 100)}%)`;

    onResult({
      mode: "form",
      prediction,
      confidence,
      top_factors,
      description,
      recommended_actions,
      urgency,
      hospital_readmission,
      readmission_probability,
    });
  };

  const fields = [
    {
      name: "age",
      label: "Age",
      icon: <FaUserAlt className="text-teal-500" />,
      min: 0,
      max: 120,
    },
    {
      name: "systolic_bp",
      label: "Systolic BP",
      icon: <FaHeartbeat className="text-teal-500" />,
      min: 50,
      max: 250,
    },
    {
      name: "diastolic_bp",
      label: "Diastolic BP",
      icon: <FaHeartbeat className="text-blue-500" />,
      min: 30,
      max: 150,
    },
    {
      name: "cholesterol",
      label: "Cholesterol",
      icon: <FaTint className="text-blue-500" />,
      min: 50,
      max: 400,
    },
  ];

  const bubbleVariants = {
    initial: { y: "100%", opacity: 0.3 },
    animate: {
      y: "-100%",
      opacity: 0.8,
      transition: {
        duration: Math.random() * 5 + 5,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "linear",
      },
    },
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-label="Health Prediction Form"
      className="relative overflow-hidden px-6 bg-white rounded-2xl shadow-lg max-w-md w-full"
    >
      {/* bubbles */}
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

      {/* fish icon */}
      <motion.div
        className="absolute top-4 right-4 text-teal-500"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 1,
          delay: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <FaFish className="text-3xl" />
      </motion.div>

      <h2 className="text-4xl font-extrabold text-teal-800 flex items-center gap-3 z-10 relative">
        <FaFish className="animate-bounce text-teal-500" />
        Health Check Waves 🌊
      </h2>

      {error && (
        <motion.div
          className="flex items-center gap-2 text-red-700 bg-red-100 p-4 rounded-lg border-2 border-red-300 z-10 relative shadow"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, type: "spring" }}
          role="alert"
        >
          <FaExclamationCircle className="text-xl" />
          <span className="font-semibold">{error}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 z-10 relative">
        {fields.map(({ name, label, icon, min, max }) => (
          <div key={name}>
            <label className="flex items-center mb-2 text-teal-700 font-bold">
              {icon}
              <span className="ml-2">{label}</span>
            </label>
            <motion.input
              type="number"
              name={name}
              placeholder={`${min} – ${max}`}
              min={min}
              max={max}
              value={String(form[name as keyof FormState])}
              onChange={handleChange}
              className="w-full p-4 border-2 rounded-xl bg-white/90 focus:ring-4 focus:ring-teal-400 transition"
              whileFocus={{
                scale: 1.02,
                boxShadow: "0 0 10px rgba(94,234,212,0.5)",
              }}
            />
          </div>
        ))}

        {/* clickable family history row */}
        <label className="sm:col-span-2 flex items-center space-x-3 mt-4 cursor-pointer z-10 relative">
          <input
            id="family_history"
            type="checkbox"
            name="family_history"
            checked={form.family_history}
            onChange={handleChange}
            className="h-6 w-6 text-teal-600 rounded border-2 focus:ring-teal-400"
          />
          <span className="font-bold text-teal-700">Family History</span>
        </label>
      </div>

      <motion.button
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold rounded-2xl mt-6 z-10 relative shadow-lg"
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 20px rgba(94,234,212,0.7)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        Predict Risk! 🐠✨
      </motion.button>
    </motion.form>
  );
}
