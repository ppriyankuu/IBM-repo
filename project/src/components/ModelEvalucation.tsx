import React from 'react';

interface ModelEvaluationsProps {
  evaluations: any;
}

const ModelEvaluations: React.FC<ModelEvaluationsProps> = ({ evaluations }) => {
  return (
    <div>
      <h2>Model Evaluations</h2>
      <h3>Logistic Regression</h3>
      <p>Accuracy: {evaluations.log_reg_accuracy}</p>
      <p>Confusion Matrix:</p>
      <pre>{JSON.stringify(evaluations.log_reg_confusion_matrix, null, 2)}</pre>
      <p>Classification Report:</p>
      <pre>{JSON.stringify(evaluations.log_reg_classification_report, null, 2)}</pre>

      <h3>KNN</h3>
      <p>Accuracy: {evaluations.knn_accuracy}</p>
      <p>Confusion Matrix:</p>
      <pre>{JSON.stringify(evaluations.knn_confusion_matrix, null, 2)}</pre>
      <p>Classification Report:</p>
      <pre>{JSON.stringify(evaluations.knn_classification_report, null, 2)}</pre>
    </div>
  );
};

export default ModelEvaluations;