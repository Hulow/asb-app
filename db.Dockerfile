FROM postgres:16-alpine
ENV POSTGRES_DB="postgres"
ENV POSTGRES_USER="docker"
ENV POSTGRES_PASSWORD="docker"
COPY ./docker/sql/001-create-owner.sql /docker-entrypoint-initdb.d/001-create-owner.sql
COPY ./docker/sql/002-create-cabinet.sql /docker-entrypoint-initdb.d/002-create-cabinet.sql
COPY ./docker/sql/003-create-driver.sql /docker-entrypoint-initdb.d/003-create-driver.sql
COPY ./docker/sql/004-create-frequency.sql /docker-entrypoint-initdb.d/004-create-frequency.sql
COPY ./docker/sql/005-create-impedance.sql /docker-entrypoint-initdb.d/005-create-impedance.sql
COPY ./docker/sql/006-create-impulse.sql /docker-entrypoint-initdb.d/006-create-impulse.sql