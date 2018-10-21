cd database && sh build_image.sh
cd .. && cd api && sh build_image.sh
cd .. && docker swarm init
docker stack deploy -c Docker-compose.yml bankapi
