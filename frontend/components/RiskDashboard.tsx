import { PredictionResponse } from "../types";
import { Bar } from "react-chartjs-2";

interface Props { data: PredictionResponse; }

export const RiskDashboard = ({ data }: Props) => {
  const { confidence, top_factors, description,
          recommended_actions, urgency,
          hospital_readmission, readmission_probability } = data;

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Risk Score: {confidence}</h2>
      <div>Category: <strong>{data.prediction.replace("_"," ")}</strong></div>
      <div>Urgency: <span className={`font-semibold ${
        urgency==="high"?"text-red-600":
        urgency==="medium"?"text-yellow-600":"text-green-600"
      }`}>{urgency}</span></div>

      <Bar
        data={{
          labels: top_factors,
          datasets: [{ label: "Factors", data: [1,1], backgroundColor: "#3b82f6" }]
        }}
        options={{ responsive:true, plugins:{ legend:{ display:false } } }}
      />

      <p>{description}</p>

      <div>
        <h3 className="font-semibold">Recommendations</h3>
        <ul className="list-disc list-inside">
          {recommended_actions.map((a,i) => (<li key={i}>{a}</li>))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold">Readmission</h3>
        <p>{hospital_readmission ? "Consider readmission" : "No readmission needed"}</p>
        <p>Probability: {readmission_probability}</p>
      </div>
    </div>
  );
};
