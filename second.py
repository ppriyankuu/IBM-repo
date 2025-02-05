import pandas as pd 
import matplotlib.pyplot as plt

df = pd.read_csv("datasets/cleaned_ufc.csv")

# other_items = ["reach_diff", "b_reach", "b_age", "r_age", "total_rounds", "age_diff", "r_reach"]

# for column in other_items:
#     df[column] = df[column].fillna(df[column].median())

# object_items = ["b_stance", "r_stance", "referee"]
# for column in object_items:
#     df[column] = df[column].fillna(df[column].mode()[0])

# print(df.info())
# print(df.isnull().sum().sum())


# Assuming your dataset is already loaded into a DataFrame called df
# If not, load it like this:
# df = pd.read_csv('your_dataset.csv')

column_to_plot = 'winner'
value_counts = df[column_to_plot].value_counts()

plt.figure(figsize=(8, 8)) 

##### PIE
# plt.pie(value_counts, labels=value_counts.index, autopct='%1.1f%%', startangle=90)
# plt.title(f'Pie Chart of Winner Column')
# plt.axis('equal')
# plt.show()

##### BAR
# kg_diff_counts = df['kd_diff'].value_counts()
# kg_diff_counts.plot(kind='bar', color='lightgreen', edgecolor='black')
# plt.title('kd difference dist.')
# plt.xlabel('KD difference')
# plt.ylabel('count')
# plt.show()

#### HIST
plt.hist(df['str_att_diff'], bins=20, color='lightcoral', edgecolor='black')
plt.title('straight attack difference dist.')
plt.xlabel('Straight attacks')
plt.ylabel('difference')
plt.show()