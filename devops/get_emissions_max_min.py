import pandas as pd
excel_data = pd.read_excel(r"\devops\2018_Carbon Emission_Final_Final.xlsx")
emissions_range = {}
max = excel_data.max(axis=0)
min = excel_data.min(axis=0)
print(excel_data.columns)
for col in excel_data.columns:
    emissions_range[col] = {
        'min': min[col],
        'max': max[col]
    }
# Write to JSON
print(emissions_range)