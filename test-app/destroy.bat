@ECHO OFF
FOR /F "usebackq" %%i IN (`hostname`) DO SET HOST_HOSTNAME=%%i
docker-compose rm
