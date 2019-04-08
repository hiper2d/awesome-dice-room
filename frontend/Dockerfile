FROM nginx:alpine
MAINTAINER hiper2d <hiper2d@gmail.com>

COPY docker/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY dist/dice-room-frontend .
