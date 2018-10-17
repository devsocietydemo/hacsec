cd database && start cmd /b /c build_image.bat 
cd .. &&  cd api && start cmd /b /c build_image.bat 
cd .. && docker swarm init
docker stack deploy -c Docker-compose.yml bankapi


