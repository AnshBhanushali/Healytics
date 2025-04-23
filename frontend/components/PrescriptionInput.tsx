import { PredictionResponse } from "../types";
import axios from "../utils/api";

interface Props { onResult: (r: PredictionResponse) => void; }

export const PrescriptionInput = ({ onResult }: Props) => {
  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const form = new FormData();
    form.append("file", e.target.files[0]);
    const { data } = await axios.post<PredictionResponse>(
      "/predict/text-image", form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    onResult(data);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <label className="block mb-2">Upload Prescription / Report</label>
      <input type="file" accept="image/*" onChange={handle} />
    </div>
  );
};
