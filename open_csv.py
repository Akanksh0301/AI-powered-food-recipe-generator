import pandas as pd

# Load the CSV
df = pd.read_csv("recipes.csv")

# Show all column names
print("All column names:\n", df.columns)

# Show the first 5 rows
print("\nFirst 5 rows:\n", df.head())

# Ingredient to search
ingredient = "mango"  # You can change this to anything

# Filter recipes that contain the ingredient
filtered_recipes = df[df['Cleaned_Ingredients'].str.contains(ingredient, case=False, na=False)]

# Print filtered results
print(f"\nRecipes with '{ingredient}':\n")
print(filtered_recipes[['Title', 'Cleaned_Ingredients']])
