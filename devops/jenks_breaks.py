from statistics import mean, median, mode, stdev
# import jenkspy
import json
import numpy as np


class JenksBreaks:
    files = [r'd:\University of Cincinnati\Digital Scholarship Center\Climate Race v2\climate_maps_v2\devops\geojson\2010_layererrorstates_all_decades_skipped_final.geojson',
             r'd:\University of Cincinnati\Digital Scholarship Center\Climate Race v2\climate_maps_v2\devops\geojson\2010_remainingstates_all_decades_skipped_final.geojson',
             r'd:\University of Cincinnati\Digital Scholarship Center\Climate Race v2\climate_maps_v2\devops\geojson\2010_layererrorstates_all_decades_skipped_final.geojson']
    decades = ['1980', '1990', '2000', '2010', '2018']
    comparisions = ['1980-1990', '1980-2000', '1980-2010', '1980-2018',
                    '1990-2000', '1990-2010', '1990-2018', '2000-2010', '2000-2018', '2010-2018']
    variables = ['FOOD', 'HOUSING', 'TRANSPORT', 'GOODS', 'SERVICE', 'TOTAL']
    years_keys = []
    comparision_keys = []

    def __init__(self) -> None:
        self.InitKeys()

    def InitKeys(self):
        for decade in self.decades:
            for variable in self.variables:
                self.years_keys.append(decade+'-'+variable)

        for comparision in self.comparisions:
            for variable in self.variables:
                self.comparision_keys.append(comparision+'-'+variable)

    def ComputeBreaks(self):
        data = {}
        distribution = {}
        keys = self.years_keys + self.comparision_keys
        for file in self.files:
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
            distribution[key] = self.GenerateBreaks(data[key], 10)

        self.WriteToFile('jenks-distribution.json', distribution)

    def ComputeBreaksPerVarAcrossYears(self):
        data = {}
        distribution = {}
        for file in self.files:
            f = open(file)
            geojson = json.load(f)
            for feature in geojson['features']:
                for key in self.years_keys:
                    splits = key.split('-')
                    variable = splits[-1]
                    if variable not in data:
                        data[variable] = []
                    if key in feature['properties']:
                        data[variable].append(feature['properties'][key])
                for key in self.comparision_keys:
                    splits = key.split('-')
                    variable = splits[-1]
                    data_key = 'COMPARISION-' + variable
                    if data_key not in data:
                        data[data_key] = []
                    if key in feature['properties']:
                        data[data_key].append(feature['properties'][key])
            f.close()

        for key in data:
            distribution[key] = self.GenerateBreaks(data[key], 10)

        self.WriteToFile('jenks-distribution-across-years.json', distribution)

    def GenerateBreaks(self, arr, classes):
        return jenkspy.jenks_breaks(arr, classes)

    def WriteToFile(self, filename, data):
        with open(filename, 'w+') as outfile:
            json.dump(data, outfile)

    def GetStats(self):
        data = {}
        distribution = {}
        for file in self.files:
            f = open(file)
            geojson = json.load(f)
            for feature in geojson['features']:
                for key in self.years_keys:
                    splits = key.split('-')
                    # variable = splits[-1]
                    if key not in data:
                        data[key] = []
                    if key in feature['properties']:
                        data[key].append(feature['properties'][key])
                for key in self.comparision_keys:
                    splits = key.split('-')
                    variable = splits[-1]
                    data_key = 'COMPARISION-' + key
                    if data_key not in data:
                        data[data_key] = []
                    if key in feature['properties']:
                        data[data_key].append(feature['properties'][key])
            f.close()
        for key in data:
            data[key] = sorted(data[key])
            _mean = mean(data[key])
            _median = median(data[key])
            _mode = mode(data[key])
            _stddev = stdev(data[key])
            _min = data[key][0]
            _max = data[key][-1]
            q1 = np.percentile(data[key], 25, method='midpoint')
            q3 = np.percentile(data[key], 75, method='midpoint')
            _iqr = q3 - q1
            distribution[key] = {
                'mean': _mean,
                'median': _median,
                'mode': _mode,
                'stddev': _stddev,
                'max': _max,
                'min': _min,
                'iqr': _iqr
            }

        self.WriteToFile('stats-across-years.json', distribution)


jb = JenksBreaks()
# jb.ComputeBreaksPerVarAcrossYears()
# jb.ComputeBreaks()
jb.GetStats()
