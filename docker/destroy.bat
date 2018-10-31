docker stack rm acmebank
docker container prune --force
docker image rm --force cgi/hacsec-mysql:0.0.1
docker image rm --force cgi/hacsec-api:0.0.1
docker image rm --force cgi/hacsec-cdn:0.0.1
docker image rm --force cgi/hacsec-redis:0.0.1
docker swarm leave --force
