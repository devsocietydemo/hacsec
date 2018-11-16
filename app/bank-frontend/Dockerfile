ARG NODE_VERSION
ARG HTTPD_VERSION

FROM node:${NODE_VERSION} as builder

WORKDIR /usr/src/app/

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM httpd:${HTTPD_VERSION}

WORKDIR /usr/local/apache2/conf/

COPY --from=builder /usr/src/app/httpd.conf .

WORKDIR /usr/local/apache2/htdocs

COPY --from=builder /usr/src/app/build .

EXPOSE 80
