docker container prune --force
docker image rm --force cgi/hacsec-test-mysql:0.0.1
docker image rm --force cgi/hacsec-test-api:0.0.1
docker image rm --force cgi/hacsec-test-cdn:0.0.1
docker image rm --force cgi/hacsec-test-redis:0.0.1
docker image rm --force cgi/hacsec-test-adminer:0.0.1
docker image rm --force cgi/hacsec-test-frontend:0.0.1