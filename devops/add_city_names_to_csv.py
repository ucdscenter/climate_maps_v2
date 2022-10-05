import pandas as pd
import json
import os


script_dir = os.path.dirname(__file__)
city_names = {}
intersection = json.load(open(r'devops\2010_intersection_fixed_geometries.geojson'))
for feat in intersection['features']:
    city_names[int(feat['properties']['GEOID10'])] = feat['properties']['NAME10_2']

def set_city_name(geoid):
    if geoid in city_names:
        return city_names[geoid]
        # for name_reg, name_list in agents.items():
    #     if agent_name in name_list:
    #         return name_reg

csv_data = pd.read_csv(script_dir + r"\2018_Carbon Emission_Demographic.csv")
csv_data['CITYNAME'] = csv_data['GEOID'].apply(set_city_name)
csv_data.to_csv('2018_Carbon Emission_Demographic_Cities.csv', index=False)

