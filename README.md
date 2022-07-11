## Setup

### Loading JSON Files (temporary step/ optional if tileserver is active)

Copy 2010 census tract jsons into `public/data/census_tracts_geojson/2010` 
### Installing packages

Run `npm i` in the project directory

### Creating .env file

Create a `.env` file in the root directory
 1. Add the following key(s) in it:
    REACT_APP_MAPBOX_API_KEY="Your mapbox key"
    REACT_APP_BASE_URL="http://localhost:portnumber". Replace portnumber with the port your app is running in locally. Should be 3000 by default.

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



### For running  tileserver
`docker run --rm -it -v $(pwd):/data -p 8080:80 maptiler/tileserver-gl `

run docker/tileserver command from folder where mbtiles files are stored.
https://github.com/maptiler/tileserver-gl

### For creating mbtiles files

https://github.com/mapbox/tippecanoe

install with brew. update

run with either 
`tippecanoe -zg -o out.mbtiles --drop-densest-as-needed in.geojson`

or 

`tippecanoe -o file.mbtiles [options] [file.json file.json.gz file.geobuf ...]`
