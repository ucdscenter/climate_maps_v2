#!/bin/bash
filename="startup_log_$(date +"%Y_%m_%d_%I_%M_%p").txt"
touch $filename
sudo yum update -y >> $filename
sudo amazon-linux-extras install docker >> $filename
sudo service docker start >> $filename
sudo usermod -a -G docker ec2-user >> $filename
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin ecr_url
docker system prune -a >> $filename
docker pull imageurl:latest
docker run -p 8080:8080 image --mbtiles z13_coalesce_2018_emissions.mbtiles