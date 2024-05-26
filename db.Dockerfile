FROM postgres:16-alpine
ENV POSTGRES_DB="postgres"
ENV POSTGRES_USER="docker"
ENV POSTGRES_PASSWORD="docker"
COPY ./docker/sql/001-create-owner.sql /docker-entrypoint-initdb.d/001-create-owner.sql
COPY ./docker/sql/002-create-cabinet.sql /docker-entrypoint-initdb.d/002-create-cabinet.sql