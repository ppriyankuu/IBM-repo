import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
import json
import numpy as np
import os
import io

# Define paths
DATA_DIR = 'datasets'
PUBLIC_DIR = 'public'
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.join(SCRIPT_DIR, '..')

# Full paths
DATA_PATH = os.path.join(BASE_DIR, DATA_DIR)
PUBLIC_DATA_PATH = os.path.join(BASE_DIR, PUBLIC_DIR, 'data')
PUBLIC_IMAGES_PATH = os.path.join(BASE_DIR, PUBLIC_DIR, 'images')

# Ensure directories exist
os.makedirs(PUBLIC_DATA_PATH, exist_ok=True)
os.makedirs(PUBLIC_IMAGES_PATH, exist_ok=True)

# Load the dataset
df = pd.read_csv(os.path.join(DATA_PATH, 'lung_cancer_prediction_dataset.csv'))

# Drop unnecessary columns and remove duplicates
df.drop(columns=['Cancer_Stage', 'Treatment_Type'], inplace=True)
df.drop_duplicates(inplace=True)

# Save the cleaned dataset
df.to_csv(os.path.join(DATA_PATH, 'cleaned-lung-cancer.csv'), index=False)

# Reload the cleaned dataset
df = pd.read_csv(os.path.join(DATA_PATH, 'cleaned-lung-cancer.csv'))

# Group data by age and calculate mean annual deaths
age_grouped = df.groupby('Age')['Annual_Lung_Cancer_Deaths'].mean().reset_index()
age_grouped_json = age_grouped.to_dict(orient='records')
with open(os.path.join(PUBLIC_DATA_PATH, 'age_grouped.json'), 'w') as f:
    json.dump(age_grouped_json, f)

# Plot average annual lung cancer deaths by age group
plt.figure(figsize=(10, 6))
plt.plot(age_grouped['Age'], age_grouped['Annual_Lung_Cancer_Deaths'], marker='o', color='red', linestyle='-', linewidth=2, label='Mean Annual Deaths')
plt.title('Average Annual Lung Cancer Deaths by Age Group', fontsize=16)
plt.xlabel('Age', fontsize=12)
plt.ylabel('Average Annual Lung Cancer Deaths', fontsize=12)
plt.grid(True)
plt.legend(fontsize=10)
plt.tight_layout()
plt.savefig(os.path.join(PUBLIC_IMAGES_PATH, 'age_grouped.png'))
plt.close()

# Get lung cancer counts by country
lung_cancer_counts = df[df['Lung_Cancer_Diagnosis'] == 'Yes']['Country'].value_counts().head(10).reset_index()
lung_cancer_counts.columns = ['Country', 'Count']
top_countries_json = lung_cancer_counts.to_dict(orient='records')
with open(os.path.join(PUBLIC_DATA_PATH, 'top_countries.json'), 'w') as f:
    json.dump(top_countries_json, f)

# Plot top 10 countries by number of lung cancer diagnoses
plt.figure(figsize=(10, 6))
bars = plt.bar(lung_cancer_counts['Country'], lung_cancer_counts['Count'], color='black', edgecolor='black')
y_max = lung_cancer_counts['Count'].max()
y_step = max(1, int(y_max / 25))
plt.yticks(range(0, y_max + y_step, y_step), fontsize=10)
for i, value in enumerate(lung_cancer_counts['Count']):
    plt.text(i, value + y_step * 0.1, str(value), ha='center', fontsize=10, color='black')
plt.title('Top 10 Countries by Number of Lung Cancer Diagnoses', fontsize=16)
plt.xlabel('Countries', fontsize=12)
plt.ylabel('Number of Lung Cancer Diagnoses', fontsize=12)
plt.xticks(rotation=45, ha='right', fontsize=10)
plt.tight_layout()
plt.savefig(os.path.join(PUBLIC_IMAGES_PATH, 'top_countries.png'))
plt.close()

# Get pollution exposure counts
lung_cancer_cases = df[df['Lung_Cancer_Diagnosis'] == 'Yes']
pollution_exposure_counts = lung_cancer_cases['Air_Pollution_Exposure'].value_counts().reset_index()
pollution_exposure_counts.columns = ['Air_Pollution_Exposure', 'Count']
pollution_exposure_counts_json = pollution_exposure_counts.to_dict(orient='records')
with open(os.path.join(PUBLIC_DATA_PATH, 'pollution_exposure_counts.json'), 'w') as f:
    json.dump(pollution_exposure_counts_json, f)

# Plot proportion of lung cancer diagnoses by air pollution exposure
plt.figure(figsize=(8, 8))
plt.pie(pollution_exposure_counts['Count'], labels=pollution_exposure_counts['Air_Pollution_Exposure'], autopct='%1.2f%%', startangle=90, colors=['lightgreen', 'tomato', 'gold'], wedgeprops={'edgecolor': 'black'})
plt.title('Proportion of Lung Cancer Diagnoses by Air Pollution Exposure', fontsize=16)
plt.tight_layout()
plt.savefig(os.path.join(PUBLIC_IMAGES_PATH, 'pollution_exposure.png'))
plt.close()

# Get lung cancer prevalence rate histogram data
hist_data, bin_edges = np.histogram(df['Lung_Cancer_Prevalence_Rate'], bins=30)
hist_data_json = {'hist_data': hist_data.tolist(), 'bin_edges': bin_edges.tolist()}
with open(os.path.join(PUBLIC_DATA_PATH, 'hist_data.json'), 'w') as f:
    json.dump(hist_data_json, f)

# Plot distribution of lung cancer prevalence rate
plt.figure(figsize=(10, 6))
plt.hist(df['Lung_Cancer_Prevalence_Rate'], bins=30, color='orange', edgecolor='black', alpha=0.7)
plt.title('Distribution of Lung Cancer Prevalence Rate', fontsize=16)
plt.xlabel('Lung Cancer Prevalence Rate (%)', fontsize=12)
plt.ylabel('Frequency', fontsize=12)
plt.grid(axis='y', linestyle='--', alpha=0.6)
plt.tight_layout()
plt.savefig(os.path.join(PUBLIC_IMAGES_PATH, 'lung_cancer_prevalence_histogram.png'))
plt.close()

# Save DataFrame info
buffer = io.StringIO()
df.info(buf=buffer)
df_info = buffer.getvalue()
with open(os.path.join(PUBLIC_DATA_PATH, 'df_info.json'), 'w') as f:
    json.dump(df_info, f)

# Prepare data for model training
df = df.drop(columns=['ID'])
X = df.drop(columns=['Lung_Cancer_Diagnosis'])
y = df['Lung_Cancer_Diagnosis'].map({'No': 0, 'Yes': 1})

# Encode categorical variables
label_encoders = {}
for column in X.columns:
    if X[column].dtype == 'object':
        le = LabelEncoder()
        X[column] = le.fit_transform(X[column])
        label_encoders[column] = le

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Scale the features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Train Logistic Regression model
log_reg = LogisticRegression()
log_reg.fit(X_train, y_train)
y_pred_log_reg = log_reg.predict(X_test)
log_reg_accuracy = accuracy_score(y_test, y_pred_log_reg)
log_reg_confusion_matrix = confusion_matrix(y_test, y_pred_log_reg).tolist()
log_reg_classification_report = classification_report(y_test, y_pred_log_reg, output_dict=True)

# Train KNN model
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)
y_pred_knn = knn.predict(X_test)
knn_accuracy = accuracy_score(y_test, y_pred_knn)
knn_confusion_matrix = confusion_matrix(y_test, y_pred_knn).tolist()
knn_classification_report = classification_report(y_test, y_pred_knn, output_dict=True)

# Train SVM model
svc_model = SVC(kernel='linear')
svc_model.fit(X_train, y_train)
y_pred_svc = svc_model.predict(X_test)
svc_accuracy = accuracy_score(y_test, y_pred_svc)
svc_confusion_matrix = confusion_matrix(y_test, y_pred_svc).tolist()
svc_classification_report = classification_report(y_test, y_pred_svc, output_dict=True, zero_division=0)

# Train Decision Tree model
dc_model = DecisionTreeClassifier(criterion='gini', random_state=42)
dc_model.fit(X_train, y_train)
y_pred_dc = dc_model.predict(X_test)
dc_accuracy = accuracy_score(y_test, y_pred_dc)
dc_confusion_matrix = confusion_matrix(y_test, y_pred_dc).tolist()
dc_classification_report = classification_report(y_test, y_pred_dc, output_dict=True, zero_division=0)

# Train Random Forest model
rf_model = RandomForestClassifier(n_estimators=100, criterion='gini', random_state=42)
rf_model.fit(X_train, y_train)
y_pred_rf = rf_model.predict(X_test)
rf_accuracy = accuracy_score(y_test, y_pred_rf)
rf_confusion_matrix = confusion_matrix(y_test, y_pred_rf).tolist()
rf_classification_report = classification_report(y_test, y_pred_rf, output_dict=True, zero_division=0)

# Save model evaluations
model_evaluations = {
    'log_reg_accuracy': log_reg_accuracy,
    'log_reg_confusion_matrix': log_reg_confusion_matrix,
    'log_reg_classification_report': log_reg_classification_report,
    'knn_accuracy': knn_accuracy,
    'knn_confusion_matrix': knn_confusion_matrix,
    'knn_classification_report': knn_classification_report,
    'svc_accuracy': svc_accuracy,
    'svc_confusion_matrix': svc_confusion_matrix,
    'svc_classification_report': svc_classification_report,
    'dc_accuracy': dc_accuracy,
    'dc_confusion_matrix': dc_confusion_matrix,
    'dc_classification_report': dc_classification_report,
    'rf_accuracy': rf_accuracy,
    'rf_confusion_matrix': rf_confusion_matrix,
    'rf_classification_report': rf_classification_report
}

with open(os.path.join(PUBLIC_DATA_PATH, 'model_evaluations.json'), 'w') as f:
    json.dump(model_evaluations, f, indent=6)