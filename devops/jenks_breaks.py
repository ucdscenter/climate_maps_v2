import jenkspy
import json

files = [r'geojson\2010_layererrorstates_all_decades_skipped_final.geojson',
         r'geojson\2010_remainingstates_all_decades_skipped_final.geojson',
         r'geojson\2010_layererrorstates_all_decades_skipped_final.geojson']
decades = ['1980', '1990', '2000', '2010', '2018', '1980-1990', '1980-2000', '1980-2010',
           '1980-2018', '1990-2000', '1990-2010', '1990-2018', '2000-2010', '2000-2018', '2010-2018']
variables = ['FOOD', 'HOUSING', 'TRANSPORT', 'GOODS', 'SERVICE', 'TOTAL']
keys = []
data = {}
distribution = {}

for decade in decades:
    for variable in variables:
        keys.append(decade+'-'+variable)


for file in files:
    f = open(file)
    geojson = json.load(f)
    for feature in geojson['features']:
        for key in keys:
            if key not in data:
                data[key] = []
            if key in feature['properties']:
                data[key].append(feature['properties'][key])
    f.close()


for key in data:
    distribution[key] = jenkspy.jenks_breaks(data[key], 10)

with open('jenks-distribution.json', 'w+') as outfile:
    json.dump(distribution, outfile)
