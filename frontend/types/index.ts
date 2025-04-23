export interface FormInput {
    age: number;
    systolic_bp: number;
    diastolic_bp: number;
    cholesterol: number;
    family_history: boolean;
  }
  
  export interface PredictionResponse {
    mode: "form" | "text-image" | "vision";
    prediction: "low_risk" | "medium_risk" | "high_risk";
    confidence: number;
    top_factors: string[];
  }
  