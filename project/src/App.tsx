import { useEffect, useState } from 'react';
import './App.css';
import AgeGroupedChart from './components/AgeGroupedChart';
import TopCountriesBarChart from './components/TopCountriesBarChart';
import PollutionExposurePieChart from './components/PollutionExposurePieChart';
import ModelEvaluations from './components/ModelEvalucation';
import smokersVSnonSmokers from './data/age_distribution.png'
import PredictionForm from './components/PredictionForm';

function App() {
  const [ageGroupedData, setAgeGroupedData] = useState<{ Age: number, Annual_Lung_Cancer_Deaths: number }[]>([]);
  const [topCountriesData, setTopCountriesData] = useState<{ Country: string, Count: number }[]>([]);
  const [pollutionExposureData, setPollutionExposureData] = useState<{ Air_Pollution_Exposure: string, Count: number }[]>([]);
  const [modelEvaluations, setModelEvaluations] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      const ageGroupedResponse = await fetch('/data/age_grouped.json');
      setAgeGroupedData(await ageGroupedResponse.json());

      const topCountriesResponse = await fetch('/data/top_countries.json');
      setTopCountriesData(await topCountriesResponse.json());

      const pollutionExposureResponse = await fetch('/data/pollution_exposure_counts.json');
      setPollutionExposureData(await pollutionExposureResponse.json());

      const modelEvaluationsResponse = await fetch('/data/model_evaluations.json');
      setModelEvaluations(await modelEvaluationsResponse.json());
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Lung Cancer Prediction Analysis</h1>
      <div className="charts-container">
        <AgeGroupedChart data={ageGroupedData} />
        <TopCountriesBarChart data={topCountriesData} />
        <PollutionExposurePieChart data={pollutionExposureData} />
        <img src={smokersVSnonSmokers} />
      </div>
      <ModelEvaluations evaluations={modelEvaluations} />
      <PredictionForm />
    </div>
  );
}

export default App;