docker stack rm bankapi
docker swarm leave --force
docker container prune --force
docker image rm --force cgi/hacsec-mysql:0.0.1 cgi/hacsec-api:0.0.1 
