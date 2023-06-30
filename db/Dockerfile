FROM mongo:latest

COPY ./query.js /docker-entrypoint-initdb.d
RUN chmod -R 777 /docker-entrypoint-initdb.d


EXPOSE 27017

