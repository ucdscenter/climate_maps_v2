import json

files = [r'D:\University of Cincinnati\Digital Scholarship Center\Climate Race v2\climate_maps_v2\devops\geojson\2010_layererrorstates_all_decades_skipped_final.geojson',
         r'D:\University of Cincinnati\Digital Scholarship Center\Climate Race v2\climate_maps_v2\devops\geojson\2010_remainingstates_all_decades_skipped_final.geojson',
         r'D:\University of Cincinnati\Digital Scholarship Center\Climate Race v2\climate_maps_v2\devops\geojson\2010_layererrorstates_all_decades_skipped_final.geojson']

max_min = {}

for file in files:
    f = open(file)
    geojson = json.load(f)
    for feature in geojson['features']:
        for prop in feature['properties']:
            if isinstance(feature['properties'][prop], str):
                continue
            if not prop in max_min:
                max_min[prop] = { 'max': float('-inf'), 'min' : float('inf')}
            else:
                max_min[prop]['max'] = max(max_min[prop]['max'], feature['properties'][prop])
                max_min[prop]['min'] = min(max_min[prop]['min'], feature['properties'][prop])

print(max_min)

f = open(r'D:\University of Cincinnati\Digital Scholarship Center\Climate Race v2\climate_maps_v2\devops\geojson\max_min_all_decades.json', 'w+')
json.dump(max_min, f)