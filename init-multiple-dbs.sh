#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
CREATE DATABASE artchain;
CREATE DATABASE "artchain_user_db";
CREATE DATABASE "artchain_wallet_db";
CREATE DATABASE "artchain_test_db";
GRANT ALL PRIVILEGES ON DATABASE artchain TO postgres;
GRANT ALL PRIVILEGES ON DATABASE "artchain_user_db" TO postgres;
GRANT ALL PRIVILEGES ON DATABASE "artchain_wallet_db" TO postgres;
GRANT ALL PRIVILEGES ON DATABASE "artchain_test_db" TO postgres;
EOSQL