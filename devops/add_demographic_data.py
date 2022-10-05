import pandas as pd
import json
import os
script_dir = os.path.dirname(__file__)
keys = ['HOUSEHOLD SIZE',
        'DEGREE>BACHELOR',
        'INCOME',
        'TENURE',
        'ROOMS',
        'VEHICLE',
        'WHITE',
        'BLACK',
        'HISPANIC']
missing_tracts = []
excel_rows = {}
excel_data = pd.read_excel(
    script_dir + r"\2018_Carbon Emission_Demographic.xlsx")
excel_json = excel_data.to_json()
for name in excel_data.iterrows():
    excel_rows[name[1]['GEOID']] = {}
    for key in keys:
        excel_rows[name[1]['GEOID']][key] = name[1][key]

final_json = {'type': 'FeatureCollection',
              'name': '2010_AllStates', 'features': []}
files = [script_dir + r'\2010_moststates_with_emmisions_data_and_cityname_fixed.json',
         script_dir + r'\2010_remainingstates_with_emmisions_data_and_cityname_fixed.json',
         script_dir + r'\2010_layererrorstates_with_emmisions_data_and_cityname_fixed.json']
for file in files:
    f = open(file)
    geojson = json.load(f)
    for feature in geojson['features']:
        # i+=1
        geoid = feature['properties']['GEOID10']
        if(int(geoid) in excel_rows):
            for key in keys:
                feature['properties'][key] = excel_rows[int(geoid)][key]
                feature['properties']['layer'] = '2010_AllStates'
        else:
            missing_tracts.append(geoid)
        final_json['features'].append(feature)
        # if i == 10000:
        #     break
    name = f.name + 'with_demographic_data'
    with open(name, 'w') as outfile:
        json.dump(final_json, outfile)
        final_json['features'] = []

with open('missing_censustracts', 'w') as outfile:
    outfile.write(str(missing_tracts))
