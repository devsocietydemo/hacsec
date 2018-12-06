ARG HTTPD_VERSION

FROM httpd:${HTTPD_VERSION}

WORKDIR /usr/local/apache2/conf/

COPY httpd.conf .

WORKDIR /usr/local/apache2/htdocs/cdn

# Bundle app source
COPY cdn .

EXPOSE 80
