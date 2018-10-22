FROM node:8

WORKDIR /usr/src/app

COPY build ./build
RUN npm install -g http-server
EXPOSE 8082
CMD http-server ./build -p8082
