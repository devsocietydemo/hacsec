cd database && sh build_image.sh
cd .. && cd api && sh build_image.sh
cd .. && cd cdn && sh build_image.sh
cd .. && cd redis && sh build_image.sh
cd .. && cd adminer && sh build_image.sh
#cd .. && docker swarm init
#docker stack deploy -c Docker-compose.yml acmebank
cd ..