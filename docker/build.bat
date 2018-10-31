cd database && call build_image.bat 
cd .. &&  cd api && call build_image.bat 
cd .. &&  cd cdn && call build_image.bat 
cd .. &&  cd redis && call build_image.bat 
cd .. &&  cd adminer && call build_image.bat 
@REM cd .. && docker swarm init
@REM docker stack deploy -c Docker-compose.yml acmebank
cd ..

