Start with building database image:

  cd database
  build_image.bat
  
Build API image:

  cd ..
  cd api
  build_image.bat

Then, initialize Docker Swarm:

  cd ..
  docker swarm init
  
Deploy stack to swarm:

  docker stack deploy -c Docker-compose.yml bankapi
  
Confirm that the application is working fine, by going to:

  http://localhost:8080
  
Login using bankappuser/AppUserPassword credentials, open database bankdb and query some tables - data should be selected correctly

Test the API by opening the following URL:

  http://localhost:3000/api/v1/customers

Destroy stack

  docker stack rm bankapi
  
Destroy stopped containers

  docker container prune
  
Delete images to ensure they are rebuilt correctly

  docker image rm cgi/hacsec-mysql:0.0.1
  docker image rm cgi/hacsec-api:0.0.1
  
Leave the swarm

  docker swarm leave --force