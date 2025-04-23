import { useState } from "react";
import axios from "../utils/api";
import { FormInput as FI, PredictionResponse } from "../types";

interface Props {
  onResult: (r: PredictionResponse) => void;
}

export const FormInput = ({ onResult }: Props) => {
  const [form, setForm] = useState<FI>({
    age: 0,
    systolic_bp: 120,
    diastolic_bp: 80,
    cholesterol: 180,
    family_history: false,
  });

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form:", form);
    const { data } = await axios.post<PredictionResponse>("/predict/form", form);
    onResult(data);
  };

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-4">
      {["age", "systolic_bp", "diastolic_bp", "cholesterol"].map((field) => (
        <div key={field}>
          <label className="block capitalize">{field.replace(/_/g, " ")}</label>
          <input
            type="number"
            name={field}
            value={(form as any)[field]}
            onChange={handle}
            className="mt-1 w-full border p-2 rounded"
          />
        </div>
      ))}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="family_history"
          checked={form.family_history}
          onChange={handle}
          className="mr-2"
        />
        <label>Family History</label>
      </div>
      <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
};
