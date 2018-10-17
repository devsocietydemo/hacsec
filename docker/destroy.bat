docker stack rm bankapi
docker container prune --force
docker image rm cgi/hacsec-mysql:0.0.1
docker image rm cgi/hacsec-api:0.0.1
docker swarm leave --force
