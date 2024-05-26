#!/bin/bash
cd /home/pobopo/projects/smart_thing/smart_thing_web
sudo docker build -t pobopobuddy/smart_thing_cloud_web:latest . && sudo docker push pobopobuddy/smart_thing_cloud_web:latest