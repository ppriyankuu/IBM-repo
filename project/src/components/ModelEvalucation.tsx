import React from 'react';

// Define types for the classification report
interface ClassificationReportEntry {
  precision?: number;
  recall?: number;
  'f1-score'?: number;
  support: number;
}

type ClassificationReport = Record<string, ClassificationReportEntry>;

// Define types for model evaluations
type ModelKey = 'log_reg' | 'knn' | 'svc' | 'dc' | 'rf';

interface Evaluations {
  // Logistic Regression
  log_reg_accuracy?: number;
  log_reg_confusion_matrix?: number[][];
  log_reg_classification_report?: ClassificationReport;

  // K-Nearest Neighbors
  knn_accuracy?: number;
  knn_confusion_matrix?: number[][];
  knn_classification_report?: ClassificationReport;

  // Support Vector Classifier
  svc_accuracy?: number;
  svc_confusion_matrix?: number[][];
  svc_classification_report?: ClassificationReport;

  // Decision Tree Classifier
  dc_accuracy?: number;
  dc_confusion_matrix?: number[][];
  dc_classification_report?: ClassificationReport;

  // Random Forest
  rf_accuracy?: number;
  rf_confusion_matrix?: number[][];
  rf_classification_report?: ClassificationReport;
}

// Table styling
const tableStyle: React.CSSProperties = {
  borderCollapse: 'collapse',
  width: '100%',
  marginBottom: '20px',
};

const thStyle: React.CSSProperties = {
  border: '1px solid #dddddd',
  textAlign: 'left',
  padding: '8px',
  backgroundColor: '#f2f2f2',
};

const tdStyle: React.CSSProperties = {
  border: '1px solid #dddddd',
  textAlign: 'left',
  padding: '8px',
};

// Confusion Matrix component
const renderConfusionMatrix = (matrix: number[][]) => (
  <table style={tableStyle}>
    <thead style={{color: 'black'}}>
      <tr>
        <th style={thStyle}></th>
        {matrix[0].map((_, index) => (
          <th key={index} style={thStyle}>
            Predicted {index}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {matrix.map((row, rowIndex) => (
        <tr key={rowIndex}>
          <td style={{...thStyle, color: 'black'}}>Actual {rowIndex}</td>
          {row.map((value, colIndex) => (
            <td key={colIndex} style={tdStyle}>
              {value}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

// Classification Report component
const renderClassificationReport = (report: ClassificationReport) => {
  const headers = ['Class', 'Precision', 'Recall', 'F1-Score', 'Support'];
  const classes = Object.keys(report).filter((key) => !['accuracy', 'macro avg', 'weighted avg'].includes(key));

  return (
    <table style={tableStyle}>
      <thead style={{color: "black"}}>
        <tr>
          {headers.map((header) => (
            <th key={header} style={thStyle}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {classes.map((cls) => {
          const entry = report[cls] as Required<ClassificationReportEntry>;
          return (
            <tr key={cls}>
              <td style={tdStyle}>{cls}</td>
              <td style={tdStyle}>{entry.precision.toFixed(2)}</td>
              <td style={tdStyle}>{entry.recall.toFixed(2)}</td>
              <td style={tdStyle}>{entry['f1-score'].toFixed(2)}</td>
              <td style={tdStyle}>{entry.support}</td>
            </tr>
          );
        })}
        {['accuracy', 'macro avg', 'weighted avg'].map((avg) => (
          report[avg] && (
            <tr key={avg}>
              <td style={tdStyle}>{avg}</td>
              <td style={tdStyle}>{report[avg].precision?.toFixed(2) || '-'}</td>
              <td style={tdStyle}>{report[avg].recall?.toFixed(2) || '-'}</td>
              <td style={tdStyle}>{report[avg]['f1-score']?.toFixed(2) || '-'}</td>
              <td style={tdStyle}>{report[avg].support}</td>
            </tr>
          )
        ))}
      </tbody>
    </table>
  );
};

// Main component
interface ModelEvaluationsProps {
  evaluations: Evaluations;
}

const ModelEvaluations = ({ evaluations }: ModelEvaluationsProps) => {
  const models = [
    { name: 'Logistic Regression', key: 'log_reg' as ModelKey },
    { name: 'K-Nearest Neighbors (KNN)', key: 'knn' as ModelKey },
    { name: 'Support Vector Classifier (SVC)', key: 'svc' as ModelKey },
    { name: 'Decision Tree Classifier (DC)', key: 'dc' as ModelKey },
    { name: 'Random Forest (RF)', key: 'rf' as ModelKey },
  ];

  return (
    <div>
      <h2>Model Evaluations</h2>
      {models.map((model) => {
        const accuracy = evaluations[`${model.key}_accuracy`];
        const confusionMatrix = evaluations[`${model.key}_confusion_matrix`];
        const classificationReport = evaluations[`${model.key}_classification_report`];

        return (
          <div key={model.key}>
            <h3>{model.name}</h3>
            <p>Accuracy: {accuracy ?? 'Not available'}</p>
            {confusionMatrix ? (
              <>
                <p>Confusion Matrix:</p>
                {renderConfusionMatrix(confusionMatrix)}
              </>
            ) : (
              <p>Confusion Matrix: Not available</p>
            )}
            {classificationReport ? (
              <>
                <p>Classification Report:</p>
                {renderClassificationReport(classificationReport)}
              </>
            ) : (
              <p>Classification Report: Not available</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ModelEvaluations;

