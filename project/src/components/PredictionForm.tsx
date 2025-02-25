import { useState } from "react";
import "./PredictionForm.css";

type YesNo = "Yes" | "No";
type PoorGood = "Poor" | "Good";
type DevelopedDeveloping = "Developed" | "Developing";

interface FormData {
  Age: string;
  Smoker: YesNo;
  Years_of_Smoking: string;
  Cigarettes_per_Day: string;
  Passive_Smoker: YesNo;
  Air_Pollution_Exposure: "Low" | "High";
  Occupational_Exposure: YesNo;
  Early_Detection: YesNo;
  Developed_or_Developing: DevelopedDeveloping;
  Family_History: YesNo;
  Indoor_Pollution: YesNo;
  Healthcare_Access: PoorGood;
}

const PredictionForm = () => {
  const [formData, setFormData] = useState<FormData>({
    Age: "",
    Smoker: "Yes",
    Years_of_Smoking: "",
    Cigarettes_per_Day: "",
    Passive_Smoker: "Yes",
    Air_Pollution_Exposure: "Low",
    Occupational_Exposure: "Yes",
    Early_Detection: "Yes",
    Developed_or_Developing: "Developed",
    Family_History: "Yes",
    Indoor_Pollution: "Yes",
    Healthcare_Access: "Poor",
  });

  const [name, setName] = useState<string>("");
  const [prediction, setPrediction] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to ${value}`); // Debugging
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise((resolve) => setTimeout(resolve, 1500));    
    const {
      Smoker,
      Cigarettes_per_Day,
      Age,
      Air_Pollution_Exposure,
      Family_History,
      Passive_Smoker,
      Occupational_Exposure,
      Indoor_Pollution,
      Healthcare_Access,
      Years_of_Smoking,
    } = formData;

    const age = parseInt(Age, 10);
    const cigarettesPerDay = parseInt(Cigarettes_per_Day, 10);
    const yearsOfSmoking = parseInt(Years_of_Smoking, 10);

    let predictionResult = "Not likely to have lung cancer";

    if (
      (Smoker === "Yes" && cigarettesPerDay > 10) ||
      (Smoker === "Yes" && yearsOfSmoking > 20) ||
      (Smoker === "Yes" && age > 50)
    ) {
      predictionResult = "Likely to have lung cancer";
    } else if (
      Passive_Smoker === "Yes" &&
      Air_Pollution_Exposure === "High" &&
      Family_History === "Yes"
    ) {
      predictionResult = "Likely to have lung cancer";
    } else if (
      Occupational_Exposure === "Yes" &&
      Indoor_Pollution === "Yes" &&
      Healthcare_Access === "Poor"
    ) {
      predictionResult = "Likely to have lung cancer";
    } else if (
      Air_Pollution_Exposure === "High" &&
      Indoor_Pollution === "Yes" &&
      age > 40
    ) {
      predictionResult = "Likely to have lung cancer";
    } else if (
      Smoker === "No" &&
      Passive_Smoker === "No" &&
      Air_Pollution_Exposure === "Low" &&
      Family_History === "No" &&
      Healthcare_Access === "Good"
    ) {
      predictionResult = "Not likely to have lung cancer";
    }

    setPrediction(predictionResult);
  };

  return (
    <div className="prediction-form-container">
      <h2>Lung Cancer Prediction</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input
            type="number"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Smoker:</label>
          <select
            name="Smoker"
            value={formData.Smoker}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="form-group">
          <label>Years of Smoking:</label>
          <input
            type="number"
            name="Years_of_Smoking"
            value={formData.Years_of_Smoking}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Cigarettes per Day:</label>
          <input
            type="number"
            name="Cigarettes_per_Day"
            value={formData.Cigarettes_per_Day}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Passive Smoker:</label>
          <select
            name="Passive_Smoker"
            value={formData.Passive_Smoker}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="form-group">
          <label>Air Pollution Exposure:</label>
          <select
            name="Air_Pollution_Exposure"
            value={formData.Air_Pollution_Exposure}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="form-group">
          <label>Occupational Exposure:</label>
          <select
            name="Occupational_Exposure"
            value={formData.Occupational_Exposure}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="form-group">
          <label>Indoor Pollution:</label>
          <select
            name="Indoor_Pollution"
            value={formData.Indoor_Pollution}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="form-group">
          <label>Healthcare Access:</label>
          <select
            name="Healthcare_Access"
            value={formData.Healthcare_Access}
            onChange={handleChange}
          >
            <option value="Poor">Poor</option>
            <option value="Good">Good</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">
          Predict
        </button>
      </form>
      {prediction && (
        <h3 className="prediction-result">
          {name} is {prediction}
        </h3>
      )}
    </div>
  );
};

export default PredictionForm;