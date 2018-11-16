ARG HTTPD_VERSION

FROM httpd:${HTTPD_VERSION}

WORKDIR /usr/local/apache2/conf/

COPY httpd.conf .

WORKDIR /usr/local/apache2/htdocs/cdn

COPY cdn .

EXPOSE 80
