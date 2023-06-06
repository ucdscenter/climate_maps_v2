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
`docker run --rm -it -v $(pwd):/data -p 8080:8080 maptiler/tileserver-gl `
OR
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


### Building on single ec2 instance
#### Docker mbtiles server
1. Create ec2 instance,  Ubuntu, at least t2 small with minimum 32gb storage, make sure port 8080 is open for incoming traffic, or be prepared to route correctly. 
2. Install docker, create folder where mbtiles file will be stored
Install docker using the first choice instructions: https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script
`mkdir mbtiles`


3. Copy mbtile file from tippecanoe creation step into instance, either from s3:
`aws s3 cp s3://mb-vector-tiles/no_maxtile_size.mbtiles no_maxtile_size.mbtiles`
or local
 `scp -i ../{ec2 key}.pem {path to mbtiles}.mbtiles ubuntu@{public ip}:/home/ubuntu/mbtiles`
4. Run docker image in ec2 instance
`cd mbtiles
sudo docker run -d --rm -it -v $(pwd):/data -p 127.0.0.1:8080:8080 maptiler/tileserver-gl --mbtiles no_maxtile_size.mbtiles`
#### Nginx & react site running

0. Copy folder created from `npm run build` into ec2 instance in build folder
in your .env file, make sure that your REACT_APP_TILES_URL is set to the ip or domain name of the instance you are hosting on. We alter nginx to forward all /data calls to the mbtiles server running at :8080. This works around the lack of localhost access in react native.
`mkdir build`
from local
`scp -i {ec2 key}.pem -r climate-maps-mapbox-gl/build/* ubuntu@{public ip}:/home/ubuntu/build/`
change permissions so folder can be accessed as project root by nginx;
`sudo chmod 755 /home/`
`sudo chmod 755 /home/ubuntu`
1. Download nginx:
`sudo apt-get install nginx`

2. Open the nginx conf file
`sudo vi /etc/nginx/sites-enabled/default`

Copy in the following code, replacing the appropriate urls and root locations if not using certbot
`server {
        listen 80;
        listen [::]:80;
        root /home/ubuntu/build;
        index index.html index.htm index.nginx-debian.html;
        #server_name ***your url*** www.***your url***;
        server_name _;
        location /data {
                proxy_pass http://127.0.0.1:8080;
                proxy_set_header Host $http_host;
                proxy_connect_timeout 10;
                proxy_read_timeout 10;
        }
        location / {
                try_files $uri /index.html;
        }
}`

Copy in the following code, replacing the appropriate urls and root locations if using certbot
`server {
        root /home/ubuntu/build;
        index index.html index.htm index.nginx-debian.html;
        server_name ***your url*** www.***your url***;
        #server_name _;
        location /data {
                proxy_pass http://127.0.0.1:8080;
                proxy_set_header Host $http_host;
                proxy_connect_timeout 10;
                proxy_read_timeout 10;
        }
        location / {
                try_files $uri /index.html;
        }
        listen [::]:443 ssl ipv6only=on; # managed by Certbot
        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/***your url***/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/***your url***/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
server {
    if ($host = www.***your url***) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
    if ($host = ***your url***) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
        listen 80;
        listen [::]:80;
        server_name ***your url*** www.***your url***;
    return 404; # managed by Certbot
}`


#### Certbot Copy or Create
1. in Route53 or whatever dns, route traffic from your domain name to whatever your server ip.
Follow the following instructions to install and setup certbot. If you're creating a new cert then go past step #7.
https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal

2. If you are copying from an existing cert, just copy the full letsencrypt folder over and unzip to the right location:
in the original server, zip letsencrypt files
`sudo tar zpcvf backup_letsencrypt.tar.gz /etc/letsencrypt/`
copy them to local
`scp -r -i **your key** ubuntu@{old ip}:/home/ubuntu/backup_letsencrypt.tar.gz .
`
copy them to new server
`scp -i backup_letsencrypt.tar.gz ubuntu@{new ip}:/home/ubuntu/
`
in new server, unzip to correct location
`sudo tar zxvf backup_letsencrypt.tar.gz -C /`



reroute traffic to the new ip

test certbot is properly working with 
`sudo certbot renew --dry-run`

3. make sure that you update your .env file with so you can access 
`REACT_APP_TILES_URL='https://{new url}'`
Then rebuild and push 
`npm run build`
` scp -i ../../**your key** -r build/* ubuntu@{new ip}:/home/ubuntu/build`



### Generate calculations for cities

This is only for adding new cities, or updating the already calculated static files

#### Cities, years, properties:
Run the Cityfiles, LR, Jenks.ipynb notebook, at the top we define a list of years, properties, cities, to add a city just find the appropriate msa name in the underlying data and add it to the list, run and recalculate extents, logistic regression models. We no longer use jenks breaks for mapping, but they're still there. Save the city files to data/chart_data, and make sure lr_models.json is in correct location.
#### Emissions ranges, extents:
Hopefully this data won't change, code should be in the devops folder.
I lost the script to calculate property_dist_info.json, but its just the output of all the subsets of years and variables and differences distributions, so just pandas.describe stdev and mean.



### Installing packages

Run `npm i` in the project directory

### Creating .env file

Create a `.env` file in the root directory
 1. Add the following key(s) in it:
    `REACT_APP_MAPBOX_API_KEY="Your mapbox key"
    REACT_APP_TILES_URL='url of mbtiles server, for local: 127.0.0.1:8080'
    REACT_APP_TILES_NAME='no_maxtile_size' * or name of mbtiles file being served
    REACT_APP_BASE_URL="".` Replace portnumber with the port your app is running in locally. Should be 3000 by default.

## Building & Running React app in npm

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
