import pandas as pd
import json
import os


script_dir = os.path.dirname(__file__)
city_names = {}
decades = {
    '1980': r'climate-maps-mapbox-gl\public\data\chart_data\1980_Carbon Emission_Demographic.csv',
    '1900': r'climate-maps-mapbox-gl\public\data\chart_data\1990_Carbon Emission_Demographic.csv',
    '2000': r'climate-maps-mapbox-gl\public\data\chart_data\2000_Carbon Emission_Demographic.csv',
    '2010': r'climate-maps-mapbox-gl\public\data\chart_data\2010_Carbon Emission_Demographic.csv',
}

intersection = json.load(open(r'climate_maps_v2\devops\geojson\2010_intersection_fixed_geometries.geojson'))
for feat in intersection['features']:
    city_names[int(feat['properties']['GEOID10'])] = feat['properties']['NAME10_2']

def set_city_name(geoid):
    if geoid in city_names:
        return city_names[geoid]


for decade in decades:
    csv_data = pd.read_csv(decades[decade])
    csv_data['CITYNAME'] = csv_data['GEOID'].apply(set_city_name)
    csv_data.to_csv(decade + '_Carbon Emission_Demographic_Cities.csv', index=False)
