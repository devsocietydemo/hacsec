FROM httpd:2

WORKDIR /usr/local/apache2/conf/

COPY httpd.conf .

WORKDIR /usr/local/apache2/htdocs/cdn

COPY cdn .

EXPOSE 80
