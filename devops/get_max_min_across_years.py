import json

f = open(r'D:\University of Cincinnati\Digital Scholarship Center\Climate Race v2\climate_maps_v2\climate-maps-mapbox-gl\src\emissions_range.json')
range = json.load(f)
years = ['1980', '1990', '2000', '2010', '2018']
combinations = [
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
variables = ['FOOD', 'HOUSING', 'TRANSPORT', 'GOODS', 'SERVICE', 'TOTAL']
max_min_all_years = {}
for variable in variables:
    for year in years:
        if variable not in max_min_all_years:
            max_min_all_years[variable] = {'min': float('inf'), 'max': float('-inf')}
        range_key = year + '-' + variable
        max_min_all_years[variable]['min'] = min(max_min_all_years[variable]['min'], range[range_key]['min'])
        max_min_all_years[variable]['max'] = max(max_min_all_years[variable]['max'], range[range_key]['max'])
        
    for combination in combinations:
        assignment_key = 'COMPARISION-'+ variable
        if assignment_key not in max_min_all_years:
            max_min_all_years[assignment_key] = {'min': float('inf'), 'max': float('-inf')}
        range_key = combination + '-' +variable
        max_min_all_years[assignment_key]['min'] = min(max_min_all_years[assignment_key]['min'], range[range_key]['min'])
        max_min_all_years[assignment_key]['max'] = max(max_min_all_years[assignment_key]['max'], range[range_key]['max'])

        

write_f = open(r'\climate_maps_v2\climate-maps-mapbox-gl\src\emissions_range_across_years.json','w+')
json.dump(max_min_all_years, write_f)