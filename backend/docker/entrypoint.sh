#!/bin/sh
while ! nc -z mongo 27017 ; do
    echo "Waiting for mongodb"
    sleep 2
done
java -jar /back.jar
