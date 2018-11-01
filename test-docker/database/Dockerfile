FROM mysql:8

ENV MYSQL_ROOT_PASSWORD=r00tp455w0rd

ADD setup.sql /docker-entrypoint-initdb.d/

ENTRYPOINT [ "docker-entrypoint.sh", "--default-authentication-plugin=mysql_native_password" ]
