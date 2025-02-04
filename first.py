import pandas as pd 
import matplotlib.pyplot as plt 

df = pd.read_csv('datasets/athletes_cleaned.csv')
# df.head()

# df.drop(columns=['influence', 'ritual', 'other_sports'], inplace=True)

# mode_fill_cols = [
#     "nationality", "nationality_full", "nationality_code", "birth_place", 
#     "birth_country", "residence_place", "residence_country", "nickname", 
#     "hobbies", "occupation", "education", "family", "lang", "coach", 
#     "reason", "hero", "philosophy", "sporting_relatives"
# ]

# for col in mode_fill_cols:
#     df[col] = df[col].fillna(df[col].mode()[0])

# df["weight"] = df["weight"].fillna(df["weight"].median())

# df.to_csv('datasets/athletes_cleaned.csv', index=False)

# print(df.info())

# Create a figure with subplots for each type of graph
fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.suptitle("Basic Plots for Dataset Analysis", fontsize=16)

# 1. Bar Graph: Count of athletes by country (Top 5)
country_counts = df['country'].value_counts().head(5)
axes[0, 0].bar(country_counts.index, country_counts.values, color='blue')
axes[0, 0].set_title("Bar Graph: Top 5 Countries")
axes[0, 0].set_xlabel("Country")
axes[0, 0].set_ylabel("Count")

# 2. Histogram: Distribution of height
axes[0, 1].hist(df['height'], bins=10, color='orange')
axes[0, 1].set_title("Histogram: Height Distribution")
axes[0, 1].set_xlabel("Height")
axes[0, 1].set_ylabel("Frequency")

# 3. Pie Chart: Proportion of disciplines (Top 3)
discipline_counts = df['disciplines'].value_counts().head(3)
axes[0, 2].pie(discipline_counts, labels=discipline_counts.index, autopct='%1.1f%%')
axes[0, 2].set_title("Pie Chart: Top 3 Disciplines")

# 4. Line Plot: Birth year trend
df['birth_year'] = pd.to_datetime(df['birth_date']).dt.year
birth_year_counts = df['birth_year'].value_counts().sort_index()
axes[1, 0].plot(birth_year_counts.index, birth_year_counts.values, color='green')
axes[1, 0].set_title("Line Plot: Birth Year Trend")
axes[1, 0].set_xlabel("Year")
axes[1, 0].set_ylabel("Number of Athletes")

# 5. Scatter Plot: Height vs Weight
axes[1, 1].scatter(df['height'], df['weight'], color='purple')
axes[1, 1].set_title("Scatter Plot: Height vs Weight")
axes[1, 1].set_xlabel("Height")
axes[1, 1].set_ylabel("Weight")

# 6. Box Plot: Weight distribution by country (Top 3 countries)
top_countries = df['country'].value_counts().index[:3]
filtered_df = df[df['country'].isin(top_countries)]
boxplot_data = [filtered_df[filtered_df['country'] == country]['weight'] for country in top_countries]
axes[1, 2].boxplot(boxplot_data, labels=top_countries)
axes[1, 2].set_title("Box Plot: Weight by Country")
axes[1, 2].set_xlabel("Country")
axes[1, 2].set_ylabel("Weight")

plt.tight_layout(rect=[0, 0, 1, 0.95])
plt.show()