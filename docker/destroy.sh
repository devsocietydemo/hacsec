docker stack rm acmebank
docker container prune --force
docker image rm cgi/hacsec-mysql:0.0.1 --force
docker image rm cgi/hacsec-api:0.0.1 --force
docker image rm cgi/hacsec-cdn:0.0.1 --force
docker swarm leave --force
