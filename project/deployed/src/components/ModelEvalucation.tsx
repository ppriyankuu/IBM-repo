import React from 'react';

// Define types for the classification report
interface ClassificationReportEntry {
  precision?: number;
  recall?: number;
  'f1-score'?: number;
  support: number;
}

type ClassificationReport = Record<string, ClassificationReportEntry>;

interface Evaluations {
  "Logistic Regression": {
    accuracy: number;
    confusion_matrix: number[][];
    classification_report: ClassificationReport;
  };
  "K-Nearest Neighbors": {
    accuracy: number;
    confusion_matrix: number[][];
    classification_report: ClassificationReport;
  };
  "Support Vector Machine": {
    accuracy: number;
    confusion_matrix: number[][];
    classification_report: ClassificationReport;
  };
  "Decision Tree": {
    accuracy: number;
    confusion_matrix: number[][];
    classification_report: ClassificationReport;
  };
  "Random Forest": {
    accuracy: number;
    confusion_matrix: number[][];
    classification_report: ClassificationReport;
  };
  "Naive Bayes": {
    accuracy: number;
    confusion_matrix: number[][];
    classification_report: ClassificationReport;
  };
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
    <thead style={{ color: 'black' }}>
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
          <td style={{ ...thStyle, color: 'black' }}>Actual {rowIndex}</td>
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
      <thead style={{ color: "black" }}>
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

const ModelEvaluations = ({ evaluations }: { evaluations: Evaluations }) => {
  const models = [
    { name: 'Logistic Regression', key: 'Logistic Regression' },
    { name: 'K-Nearest Neighbors (KNN)', key: 'K-Nearest Neighbors' },
    { name: 'Support Vector Machine (SVM)', key: 'Support Vector Machine' },
    { name: 'Decision Tree Classifier (DC)', key: 'Decision Tree' },
    { name: 'Random Forest (RF)', key: 'Random Forest' },
    { name: 'Gaussian Naive Bayes (GNB)', key: 'Naive Bayes' },
  ];

  return (
    <div>
      <h2>Model Evaluations</h2>
      {models.map((model) => {
        // Use a type assertion here
        const modelData = evaluations[model.key as keyof Evaluations];
        if (!modelData) {
          return null; // Skip if data is missing
        }

        const { accuracy, confusion_matrix, classification_report } = modelData;

        return (
          <div key={model.key}>
            <h3>{model.name}</h3>
            <p>Accuracy: {accuracy.toFixed(2)}</p>
            {confusion_matrix ? (
              <>
                <p>Confusion Matrix:</p>
                {renderConfusionMatrix(confusion_matrix)}
              </>
            ) : (
              <p>Confusion Matrix: Not available</p>
            )}
            {classification_report ? (
              <>
                <p>Classification Report:</p>
                {renderClassificationReport(classification_report)}
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