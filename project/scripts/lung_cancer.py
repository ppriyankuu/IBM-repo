import pandas as pd
import numpy as np
import json
import os
import joblib
from decimal import Decimal
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.utils.class_weight import compute_class_weight

# Define directories
DATA_DIR = 'datasets'
PUBLIC_DIR = 'src'
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.join(SCRIPT_DIR, '..')
DATA_PATH = os.path.join(BASE_DIR, DATA_DIR)
PUBLIC_DATA_PATH = os.path.join(BASE_DIR, PUBLIC_DIR, 'data')

os.makedirs(PUBLIC_DATA_PATH, exist_ok=True)

# Load and preprocess the dataset
df = pd.read_csv(os.path.join(DATA_PATH, 'lung_cancer_prediction_dataset.csv'))
df.drop(columns=['Cancer_Stage', 'Treatment_Type'], inplace=True)
df.drop_duplicates(inplace=True)

# Encode target variable
df['Lung_Cancer_Diagnosis'] = df['Lung_Cancer_Diagnosis'].map({'No': 0, 'Yes': 1})

# Separate features and target
data = df.drop(columns=['Lung_Cancer_Diagnosis'])
X = data[['Age', 'Smoker', 'Years_of_Smoking', 'Cigarettes_per_Day', 
          'Passive_Smoker', 'Air_Pollution_Exposure', 
          'Occupational_Exposure', 'Early_Detection', 'Developed_or_Developing',
          'Family_History', 'Indoor_Pollution', 'Healthcare_Access']].copy()
y = df['Lung_Cancer_Diagnosis']

# Encode categorical features
categorical_columns = X.select_dtypes(include=['object']).columns
label_encoders = {}
for column in categorical_columns:
    le = LabelEncoder()
    X[column] = le.fit_transform(X[column])
    label_encoders[column] = le

# Save label encoders
joblib.dump(label_encoders, os.path.join(PUBLIC_DATA_PATH, "label_encoders.pkl"))

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Scale the features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)
joblib.dump(scaler, os.path.join(PUBLIC_DATA_PATH, "scaler.pkl"))

# Compute class weights to handle class imbalance
class_weights = compute_class_weight(class_weight='balanced', classes=np.unique(y_train), y=y_train)
class_weight_dict = dict(zip(np.unique(y_train), class_weights))

# Initialize and train models with class weights
models = {
    "Logistic Regression": LogisticRegression(),
    "K-Nearest Neighbors": KNeighborsClassifier(n_neighbors=5),
    "Support Vector Machine": SVC(kernel='linear'),
    "Decision Tree": DecisionTreeClassifier(criterion='gini', random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=100, criterion='gini', random_state=42),
    "Naive Bayes": GaussianNB()
}

model_evaluations = {}
for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    confusion_mat = confusion_matrix(y_test, y_pred).tolist()
    class_report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)
    
    model_evaluations[name] = {
        "accuracy": float(Decimal(str(accuracy)).quantize(Decimal('0.0001'))),
        "confusion_matrix": confusion_mat,
        "classification_report": {k: float(Decimal(str(v)).quantize(Decimal('0.0001'))) 
                                  if isinstance(v, float) else v 
                                  for k, v in class_report.items()}
    }

# Save model evaluations
# with open(os.path.join(PUBLIC_DATA_PATH, 'model_evaluations.json'), 'w') as f:
#     json.dump(model_evaluations, f, indent=6)

# Select the best model based on accuracy
best_model_name = max(model_evaluations, key=lambda x: model_evaluations[x]['accuracy'])
best_model = models[best_model_name]
joblib.dump(best_model, os.path.join(PUBLIC_DATA_PATH, "best_model.pkl"))

# Example prediction with new data
fake_data = {
    "Age": 65,
    "Smoker": 'Yes',
    "Years_of_Smoking": 40,
    "Cigarettes_per_Day": 20,
    "Passive_Smoker": 'Yes',
    "Air_Pollution_Exposure": 'Low',
    "Occupational_Exposure": 'Yes',
    "Early_Detection": 'Yes',
    "Developed_or_Developing": 'Developed',
    "Family_History": 'Yes',
    "Indoor_Pollution": 'Yes',
    "Healthcare_Access": 'Poor'
}

# Convert fake data to DataFrame
fake_df = pd.DataFrame([fake_data])

# Encode categorical features in fake data
for column, le in label_encoders.items():
    fake_df[column] = le.transform(fake_df[column])

# Scale features
scaled_fake_data = scaler.transform(fake_df.values)

# Predict
prediction = best_model.predict(scaled_fake_data)

if prediction[0] == 1:
    print("The model predicts the patient is likely to have lung cancer (1).")
else:
    print("The model predicts the patient does NOT have lung cancer (0).")