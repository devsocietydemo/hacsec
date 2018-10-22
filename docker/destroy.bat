docker stack rm bankapi
docker container prune --force
docker image rm --force cgi/hacsec-mysql:0.0.1
docker image rm --force cgi/hacsec-api:0.0.1
docker swarm leave --force
