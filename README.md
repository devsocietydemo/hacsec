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
  . build.sh
```

__or destroy the stack.__

Windows:
```console
  .\destroy.bat
```
Unix:
```console
  . destroy.sh
```

### Testing the build

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

### Manual build instructions

***__IMPORTANT:__***
__All the following commands takes a /docker as a root directory.__

__Start with building database image:__

Windows:
```console
  cd database && build_image.bat
```
Unix:
```console
  cd database && sh build_image.sh
```


__Build API image:__

Windows:
```console
  cd .. && cd api && build_image.bat
```
Unix:
```console
  cd .. && cd api && sh build_image.sh
```


__Then, initialize Docker Swarm:__

```console
  cd .. && docker swarm init
```

__Deploy stack to swarm:__

```console
  docker stack deploy -c Docker-compose.yml bankapi
```


### Manual destroy instructions

__Destroy stack__

```console
  docker stack rm bankapi
```

__Destroy stopped containers__
```console
  docker container prune --force
```

__Delete images to ensure they are rebuilt correctly__
```console
  docker image rm cgi/hacsec-mysql:0.0.1
  docker image rm cgi/hacsec-api:0.0.1
```

__Leave the swarm__
```console
  docker swarm leave --force
```

# Frontend

After the backend setup, install the frontend to have a visual access to the banking app.

### Installation

- Install Yarn:

  `npm install -g yarn`

- Go to the `app/bank-frontend/`

- Run the application

  `yarn start`

- Application should be running at http://localhost:8081

### How to play with that?

Log in using customer ID and password.

You should be redirected to accounts list. Click on the accounts to preview the balance.

This UI app contains proxy to the REST API (to the port :3000). The proxy is defined in package.json.
