cd database && call build_image.bat 
cd .. &&  cd api && call build_image.bat 
cd .. &&  cd cdn && call build_image.bat 
cd .. && docker swarm init
docker stack deploy -c Docker-compose.yml acmebank


