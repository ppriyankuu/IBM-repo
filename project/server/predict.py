import pandas as pd
import sys
import json
import joblib
import os

# Define the path to the directory containing the saved encoders and scaler
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')

# Load the trained model, label encoders, and scaler
model = joblib.load(os.path.join(DATA_DIR, "best_model.pkl"))
label_encoders = joblib.load(os.path.join(DATA_DIR, "label_encoders.pkl"))
scaler = joblib.load(os.path.join(DATA_DIR, "scaler.pkl"))

# Read input data from command-line argument
input_data = json.loads(sys.argv[1])

# Convert input data to DataFrame
input_df = pd.DataFrame([input_data])

# Encode categorical features
for column, le in label_encoders.items():
    if column in input_df.columns:
        input_df[column] = le.transform(input_df[column])

feature_columns = ['Age', 'Smoker', 'Years_of_Smoking', 'Cigarettes_per_Day', 
                   'Passive_Smoker', 'Air_Pollution_Exposure', 
                   'Occupational_Exposure', 'Early_Detection', 'Developed_or_Developing',
                   'Family_History', 'Indoor_Pollution', 'Healthcare_Access']
input_df = input_df.reindex(columns=feature_columns, fill_value=0)

# Standardize numerical features
input_scaled = scaler.transform(input_df)

# Make a prediction
prediction = model.predict(input_scaled)

# Output the prediction
print(int(prediction[0]))