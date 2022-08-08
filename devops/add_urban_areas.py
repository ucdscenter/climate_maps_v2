import json

city_names = {}
intersection = json.load(open(r'devops\2010_intersection.geojson'))
for feat in intersection['features']:
    city_names[feat['properties']['GEOID10_2']] = feat['properties']['NAME10']

final_json = { 'type':'FeatureCollection','name':'2010_AllStates', 'features':[] }
files = [r'devops\2010_moststates_with_emmisions_data.json',
         r'\devops\2010_remainingstates_with_emmisions_data.json',
         r'devops\2010_layererrorstates_with_emmisions_data.json']
for file in files:   
    f = open(file)
    geojson = json.load(f)
    for feature in geojson['features']:
        geoid = feature['properties']['GEOID10']
        if(geoid in city_names):
            print(geoid+city_names[geoid])
            feature['properties']['CITYNAME'] = city_names[geoid]
            feature['properties']['layer'] = '2010_AllStates'
        final_json['features'].append(feature)
    name = f.name + 'and_cityname.json'
    with open(name, 'w') as outfile:
        json.dump(final_json, outfile)
        final_json['features'] = []