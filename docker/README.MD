## Manual build instructions

# Start with building database image:

Windows:
```console
  cd database && build_image.bat
```
Unix:
```console
  cd database && sh build_image.sh
```


# Build API image:

Windows:
```console
  cd .. && cd api && build_image.bat
```
Unix:
```console
  cd .. && cd api && sh build_image.sh
```


# Then, initialize Docker Swarm:

```console
  cd .. && docker swarm init
```

# Deploy stack to swarm:

```console
  docker stack deploy -c Docker-compose.yml bankapi
```

## Automated build instructions - Unix only

# You can use the shellscripts in /docker to build all the stack...

```console
  . build.sh
```

# or destroy the stack.

```console
  . destroy.sh
```

## Testing the build

Confirm that the application is working fine, by going to:

  http://localhost:8080

Login using bankappuser/AppUserPassword credentials, open database bankdb and query some tables - data should be selected correctly

Test the API by opening the following URL:

  http://localhost:3000/api/v1/customers

You can also retrieve specific customer data using direct URL:

  http://localhost:3000/api/v1/customers/2241

  http://localhost:3000/api/v1/customers/2242  

  http://localhost:3000/api/v1/customers/2242/accounts

  http://localhost:3000/api/v1/accounts/86436

  http://localhost:3000/api/v1/accounts/86436/transactions

  http://localhost:3000/api/v1/transactions/12316133

## Destroy stack

```console
  docker stack rm bankapi
```
Destroy stopped containers
```console
  docker container prune --force
```
Delete images to ensure they are rebuilt correctly
```console
  docker image rm cgi/hacsec-mysql:0.0.1
  docker image rm cgi/hacsec-api:0.0.1
```

Leave the swarm
```console
  docker swarm leave --force
```
