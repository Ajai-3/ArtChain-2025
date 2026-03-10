#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
CREATE DATABASE artchain;
CREATE DATABASE "artchain-user-admin-service";
CREATE DATABASE "artchain-wallet-service";
CREATE DATABASE "artchain-test-service";
GRANT ALL PRIVILEGES ON DATABASE artchain TO postgres;
GRANT ALL PRIVILEGES ON DATABASE "artchain-user-admin-service" TO postgres;
GRANT ALL PRIVILEGES ON DATABASE "artchain-wallet-service" TO postgres;
GRANT ALL PRIVILEGES ON DATABASE "artchain-test-service" TO postgres;
EOSQL