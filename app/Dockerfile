FROM node:18.3.0-alpine3.16

WORKDIR /usr/src/app-crud
COPY ./ .

USER root

# add jq libs to extract file json of the result tes
RUN apk add jq

RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 180000
RUN npm install

RUN chmod 770 ./command.sh
CMD ./command.sh



