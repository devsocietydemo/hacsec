@ECHO OFF
SETLOCAL
SET MYSQL_VERSION=8.0.13
SET NODE_VERSION=8.12.0
SET HTTPD_VERSION=2.4.37
SET ADMINER_VERSION=4.6.3
SET REDIS_VERSION=5.0.1

docker pull adminer:%ADMINER_VERSION%
docker pull node:%NODE_VERSION%
docker pull httpd:%HTTPD_VERSION%
docker pull mysql:%MYSQL_VERSION%
docker pull redis:%REDIS_VERSION%
