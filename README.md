# Security hackathon - "Banking App"

__Table of contents__

- [Backend](#backend)
	- [Automated build instructions](#automated-build-instructions)
	- [Testing the build](#testing-the-build)
	- [Manual build instructions](#manual-build-instructions)
	- [Manual destroy instructions](#manual-destroy-instructions)
- [Frontend](#frontend)
	- [Installation](#installation)
	- [How to play with that?](#how-to-play-with-that)

# Backend

The backend of application consists of

- node.js express server - used as a REST API

- MySQL Database - used as a main database

- Redis storage - used as a storage of sessions in REST.

### Automated build instructions

__You can use the shellscripts in /docker to build all the stack...__

Windows:
```console
  .\build.bat
```
Unix:
```console
  .\build.sh
```

__or destroy the stack.__

Windows:
```console
  .\destroy.bat
```
Unix:
```console
  .\destroy.sh
```

### Running application

After build is completed, start the application using automatic start script:

Windows:
```console
  .\start.bat
```
Unix:
```console
  .\start.sh
```

Stop the application using automatic stop script:

Windows:
```console
  .\stop.bat
```
Unix:
```console
  .\stop.sh
```

### Testing the build

Confirm that the application is working fine, by going to:

  http://localhost:8081

You can also access database directly:

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

### Manual build instructions

***__IMPORTANT:__***
__All the following commands takes a /docker as a root directory.__

__Start with building database image:__

Windows:
```console
  cd database && call build_image.bat && cd ..
```
Unix:
```console
  cd database && sh build_image.sh && cd ..
```


__Build API image:__

Windows:
```console
  cd api && call build_image.bat && cd ..
```
Unix:
```console
  cd api && sh build_image.sh && cd ..
```


__Build CDN image:__

Windows:
```console
  cd cdn && call build_image.bat && cd ..
```
Unix:
```console
  cd cdn && sh build_image.sh && cd ..
```


__Build Redis image:__

Windows:
```console
  cd redis && call build_image.bat && cd .. 
```
Unix:
```console
  cd redis && sh build_image.sh && cd ..
```


__Build Adminer image:__

Windows:
```console
  cd adminer && call build_image.bat && cd ..
```
Unix:
```console
  cd adminer && sh build_image.sh && cd ..
```


__Build Frontend image:__

Windows:
```console
  cd frontend && call build_image.bat && cd ..
```
Unix:
```console
  cd frontend && sh build_image.sh && cd ..
```


__Then, start the application using Docker Compose:__

```console
  docker-compose up -d
```

### Manual destroy instructions

__Stop the application__
```console
  docker-compose down
```

__Destroy stopped containers__
```console
  docker container prune --force
```

__Delete images to ensure they are rebuilt correctly__
```console
  docker image rm cgi/hacsec-mysql:0.0.1 --force
  docker image rm cgi/hacsec-api:0.0.1 --force
  docker image rm cgi/hacsec-cdn:0.0.1 --force
  docker image rm cgi/hacsec-redis:0.0.1 --force
  docker image rm cgi/hacsec-adminer:0.0.1 --force
  docker image rm cgi/hacsec-frontend:0.0.1 --force
```

# Frontend

Log in using customer ID and password: 2241/password.

You should be redirected to accounts list. Click on the accounts to preview the balance.

This UI app contains proxy to the REST API (to the port :3000). The proxy is defined in package.json.
