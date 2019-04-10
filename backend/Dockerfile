FROM openjdk:8-jre-alpine
MAINTAINER hiper2d <hiper2d@gmail.com>

COPY build/libs/backend*.jar /back.jar
COPY docker/entrypoint.sh /opt/backend/bin/

RUN chmod 755 /opt/backend/bin/entrypoint.sh
