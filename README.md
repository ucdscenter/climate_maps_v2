# Setup

## Backend & Precalculation

You will need access to the geojson files containing all of the calculated data before creating the static files for deployment, derived from qgis shape files, MSAs from 2010
`2010_layererrorstates_all_decades_skipped_final.geojson 2010_remainingstates_all_decades_skipped_final.geojson 2010_moststates_all_decades_skipped_final.geojson`

### Creating mbtiles files

Isn't necessary if you already have a .mbtiles file you're using, you can skip to deployment

install: https://github.com/mapbox/tippecanoe

install with brew. update

`brew install tippecanoe`

run with either 
`tippecanoe -zg -o out.mbtiles --drop-densest-as-needed in.geojson`

or 

`tippecanoe -o file.mbtiles [options] [file.json file.json.gz file.geobuf ...]`

to create the current mbtiles file we ran from the folder where all these exist:
`tippecanoe -z12 -Z3 -o no_maxtile_size.mbtiles --no-tile-size-limit -l censustracts   2010_layererrorstates_all_decades_skipped_final.geojson 2010_remainingstates_all_decades_skipped_final.geojson 2010_moststates_all_decades_skipped_final.geojson`

### Mbtiles Server Deployment

#### For running  tileserver locally
`docker run --rm -it -v $(pwd):/data -p 8080:80 maptiler/tileserver-gl `

run docker/tileserver command from folder where mbtiles files are stored.
https://github.com/maptiler/tileserver-gl

#### Deploy with Docker
1. Add the mbtiles file to s3 bucket
2. Build and tag docker image by replacing url and file name in the Dockerfile of the forked tileserver repo
    Optional step if token has expired: `(Get-ECRLoginCommand).Password | docker login --username AWS --password-stdin ecr_repo_url.com`
    `docker build -t climate-maps-tileserver .`
    `docker tag climate-maps-tileserver:latest ecr_repo_url.com/climate-maps-tileserver:latest`
3. Push the container to ECR
    `docker push ecr_repo_url/climate-maps-tileserver:latest`
4. Modify userdata script in ec2 instance if file name has changed.
5. Start the instance

#### If the docker container won't build in the instance, then run it with public container

1. Create ec2 instance, Amazon Linux (or Ubuntu), at least t2 small with minimum 32gb storage, make sure port 8080 is open for incoming traffic, or be prepared to route correctly. Install docker 
`aws s3 cp s3://mb-vector-tiles/no_maxtile_size.mbtiles no_maxtile_size.mbtiles`
2. Copy the mbtiles file from s3 into the ec2 instance 
`docker run -d --rm -it -v $(pwd):/data -p 8080:80 maptiler/tileserver-gl --mbtiles no_maxtile_size.mbtiles`


### Generate calculations for cities

This is only for adding new cities, or updating the already calculated static files

#### Cities, years, properties:
Run the Cityfiles, LR, Jenks.ipynb notebook, at the top we define a list of years, properties, cities, to add a city just find the appropriate msa name in the underlying data and add it to the list, run and recalculate extents, logistic regression models. We no longer use jenks breaks for mapping, but they're still there. Save the city files to data/chart_data, and make sure lr_models.json is in correct location.
#### Emissions ranges, extents:
Hopefully this data won't change, code should be in the devops folder.
I lost the script to calculate property_dist_info.json, but its just the output of all the subsets of years and variables and differences distributions, so just pandas.describe stdev and mean.


### To set up with nginx reverse proxy:
Upcoming
#### React Server
#### Mbtiles Server

### To set up with certbot certificate:
Upcoming
#### React Server
#### Mbtiles Server


### Installing packages

Run `npm i` in the project directory

### Creating .env file

Create a `.env` file in the root directory
 1. Add the following key(s) in it:
    `REACT_APP_MAPBOX_API_KEY="Your mapbox key"
    REACT_APP_TILES_URL='url of mbtiles server, for local: 127.0.0.1:8080'
    REACT_APP_TILES_NAME='no_maxtile_size' * or name of mbtiles file being served
    REACT_APP_BASE_URL="".` Replace portnumber with the port your app is running in locally. Should be 3000 by default.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run deploy 's3_url'`

This command will push the build folder to s3 bucket.

### Or copy the build folder to correct location with scp!
