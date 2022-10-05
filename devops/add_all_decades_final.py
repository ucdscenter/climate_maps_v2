import pandas as pd
import json
import os
import math

# columns = {
#     '2000': ['GEOID', 'FOODHOME_LN', 'FOODAWAY', 'ALCBEV', 'OWNDWE', 'RENTDWE', 'OTHLOD', 'UTIL', 'HOUSOP', 'HOUSEQ', 'HOUKEEP', 'APPR', 'VEHPUR', 'GASOIL', 'OTHVEH', 'PUBTRAN', 'HEALTH', 'ENTER', 'PERCARE', 'READING', 'EDUC', 'TABACC', 'MISCELL', 'CASHCON', 'PERINC', 'VMT', 'VMT_CO2', 'FOOD', 'HOUSING', 'TRANSPORT', 'GOODS', 'SERVICE', 'TOTAL', 'POP', 'Density', 'White', 'Black', 'Hispanic', 'Size', 'Degree', 'Income', 'Tenure', 'Rooms', 'Vehicles', ],
#     '2010': ['GEOID', 'FOODHOME_LN', 'FOODAWAY', 'ALCBEV', 'OWNDWE', 'RENTDWE', 'OTHLOD', 'UTIL', 'HOUSOP', 'HOUSEQ', 'HOUKEEP', 'APPR', 'VEHPUR', 'GASOIL', 'OTHVEH', 'PUBTRAN', 'HEALTH', 'ENTER', 'PERCARE', 'READING', 'EDUC', 'TABACC', 'MISCELL', 'CASHCON', 'PERINC', 'VMT', 'VMT_CO2', 'FOOD', 'HOUSING', 'TRANSPORT', 'GOODS', 'SERVICE', 'TOTAL', 'Size', 'Degree', 'Income', 'Tenure', 'Rooms', 'Vehicle', 'White', 'Black', 'Hispanic'],
#     '2018': ['GEOID', 'STATE', 'FOODHOME_LN', 'FOODAWAY', 'ALCBEV', 'OWNDWE', 'RENTDWE', 'OTHLOD', 'UTIL', 'HOUSOP', 'HOUKEEP', 'HOUSEQ', 'APPR', 'VEHPUR', 'GASOIL', 'OTHVEH', 'PUBTRAN', 'HEALTH', 'ENTER', 'PERCARE', 'READING', 'EDUC', 'TABACC', 'MISCELL', 'CASHCON', 'PERINC', 'VMT', 'VMT_CO2', 'FOOD', 'HOUSING', 'TRANSPORT', 'GOODS', 'SERVICE', 'TOTAL', 'HOUSEHOLD SIZE', 'DEGREE>BACHELOR', 'INCOME', 'TENURE', 'ROOMS', 'VEHICLE ', 'WHITE', 'BLACK', 'HISPANIC']
# }

final_columns = ['FOOD', 'HOUSING', 'TRANSPORT', 'GOODS', 'SERVICE', 'TOTAL', 'WHITE', 'BLACK', 'HISPANIC','DEGREE', 'HOUSEHOLD SIZE', 'INCOME', 'TENURE']

decades = {
    '1980': r'devops\all decades data\1980_Carbon Emission_1.xlsx',
    '1990': r'devops\all decades data\1990_Carbon Emission_1.xlsx',
    '2000': r'devops\all decades data\2000_Carbon Emission_1.xlsx',
    '2010': r'devops\all decades data\2010_Carbon Emission_1.xlsx',
    '2018': r'devops\all decades data\2018_Carbon Emission_Demographic.xlsx',
}

city_names = {}
final_json = {'type': 'FeatureCollection',
              'name': 'AllDecades', 'features': []}

# Read from excels
excel_rows = {
    '1980': {},
    '1990': {},
    '2000': {},
    '2010': {},
    '2018': {},
}
for decade in decades:
    excel_data = pd.read_excel(decades[decade])
    for name in excel_data.iterrows():
        excel_rows[decade][name[1]['GEOID']] = {}
        for key in final_columns:
            excel_rows[decade][name[1]['GEOID']][key] = name[1][key]

# Add city names
intersection = json.load(open(
    r'D:\University of Cincinnati\Digital Scholarship Center\Climate Race v2\climate_maps_v2\devops\geojson\2010_intersection_fixed_geometries.geojson'))
for feat in intersection['features']:
    city_names[feat['properties']['GEOID10']] = feat['properties']['NAME10_2']

files = [r'D:\University of Cincinnati\Digital Scholarship Center\Climate Race v2\climate_maps_v2\devops\geojson\2010_moststates.json',
         r'D:\University of Cincinnati\Digital Scholarship Center\Climate Race v2\climate_maps_v2\devops\geojson\2010_remainingstates.json',
         r'D:\University of Cincinnati\Digital Scholarship Center\Climate Race v2\climate_maps_v2\devops\geojson\2010_layererrorstates.json']
missing_tracts = set()
missing_combinations = {
    '1980-1990': [],
    '1980-2000': [],
    '1980-2010': [],
    '1980-2018': [],
    '1990-2000': [],
    '1990-2010': [],
    '1990-2018': [],
    '2000-2010': [],
    '2000-2018': [],
    '2010-2018': []
}
comparisions = [
    '1980-1990',
    '1980-2000',
    '1980-2010',
    '1980-2018',
    '1990-2000',
    '1990-2010',
    '1990-2018',
    '2000-2010',
    '2000-2018',
    '2010-2018'
]

for file in files:
    f = open(file)
    geojson = json.load(f)
    for feature in geojson['features']:
        geoid = feature['properties']['GEOID10']
        for decade in decades:
            if(int(geoid) in excel_rows[decade]):
                # feature['properties'][decade] = {}
                for key in final_columns:
                    prop_key = decade + '-' + key
                    value = excel_rows[decade][int(geoid)][key]
                    if(math.isfinite(value)):
                        feature['properties'][prop_key] = excel_rows[decade][int(geoid)][key]
                feature['properties']['layer'] = 'AllDecades'
            else:
                missing_tracts.add(geoid)
        for comparision in comparisions:
            comp_key = comparision
            comps = comparision.split('-')
            first = comps[0]
            second = comps[1]
            if int(geoid) in excel_rows[first] and int(geoid) in excel_rows[second]:
                # feature['properties'][comp_key] = {}
                for key in final_columns:
                    comp_prop_key = comp_key + '-' +  key
                    secondval = excel_rows[second][int(
                        geoid)][key]
                    firstval = excel_rows[first][int(geoid)][key]
                    if(math.isfinite(firstval) and math.isfinite(secondval)):
                        feature['properties'][comp_prop_key] = secondval - firstval
                feature['properties']['layer'] = 'AllDecades'
            else:
                missing_combinations[comp_key].append(geoid)

        if(geoid in city_names):
            # print(geoid+city_names[geoid])
            feature['properties']['CITYNAME'] = city_names[geoid]

        final_json['features'].append(feature)
        # if i == 10000:
        #     break
    name = f.name + '_all_decades_skipped_final'
    with open(name, 'w') as outfile:
        json.dump(final_json, outfile)
        final_json['features'] = []

with open('missing_censustracts_all_decaded_final', 'w') as outfile:
    outfile.write(str(missing_tracts))
with open('missing_combinations_all_decades_final', 'w') as outfile:
    outfile.write(str(missing_combinations))
