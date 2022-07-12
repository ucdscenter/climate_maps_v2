import pandas as pd
import json

keys = ['STATE', 'FOODHOME_LN', 'FOODAWAY', 'ALCBEV', 'OWNDWE',
       'RENTDWE', 'OTHLOD', 'UTIL', 'HOUSOP', 'HOUKEEP', 'HOUSEQ', 'APPR',
       'VEHPUR', 'GASOIL', 'OTHVEH', 'PUBTRAN', 'HEALTH', 'ENTER', 'PERCARE',
       'READING', 'EDUC', 'TABACC', 'MISCELL', 'CASHCON', 'PERINC', 'VMT',
       'VMT_CO2', 'FOOD', 'HOUSING', 'TRANSPORT', 'GOODS', 'SERVICE', 'TOTAL']
missing_tracts = []
excel_rows = {}
excel_data = pd.read_excel(r"\devops\2018_Carbon Emission_Final_Final.xlsx")
for name in excel_data.iterrows():
    excel_rows[name[1]['GEOID']] = {}
    for key in keys:
        excel_rows[name[1]['GEOID']][key] = name[1][key]

final_json = { 'type':'FeatureCollection','name':'2010_AllStates', 'features':[] }
files = [r'\devops\2010_moststates.json',
         r'\devops\2010_remainingstates.json',
         r'\devops\2010_layererrorstates.json']
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
    name = f.name + 'with_emmisions_data'
    with open(name, 'w') as outfile:
        json.dump(final_json, outfile)
        final_json['features'] = []
            
with open('missing_censustracts', 'w') as outfile:
    outfile.write(str(missing_tracts))
