FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=rootpassword

COPY customers.csv /tmp/
COPY accounts.csv /tmp/
COPY account_ownership.csv /tmp/
COPY transactions.csv /tmp/

ADD setup.sql /docker-entrypoint-initdb.d/
