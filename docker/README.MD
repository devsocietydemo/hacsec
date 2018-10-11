Start with building database image:

  cd database
  build_image.bat

Then, initialize Docker Swarm:

  cd ..
  docker swarm init
  
Deploy stack to swarm:

  docker stack deploy -c Docker-compose.yml mysql
  
Confirm that the application is working fine, by going to:

  http://localhost:8080
  
Login using bankappuser/AppUserPassword credentials, open database bankdb and query some tables - data should be selected correctly

Destroy stack

  docker stack rm mysql
  
Destroy stopped containers

  docker container prune
  
Delete image to ensure it's rebuilt correctly

  docker image rm cgi/hacsec-mysql:0.0.1
  
  