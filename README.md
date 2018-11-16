# Security hackathon - "Banking App"

__Table of contents__

- [Compatibility Test Application](#compatibility-test-application)
	- [Automated build instructions (Test)](#automated-build-instructions-test)
	- [Testing the build (Test)](#testing-the-build-test)
- [Banking Application](#banking-application)
	- [Automated build instructions (Bank)](#automated-build-instructions-bank)
	- [Testing the build (Bank)](#testing-the-build-bank)
	- [How to play with that?](#how-to-play-with-that)

# Compatibility Test Application

This application was created to test participants' machines compatibility with the final bank application. It consists of the following modules:

- node.js express server - used as a REST API

- MySQL Database - used as a main database

- Adminer - database administration tool

- Redis storage - used as a storage of sessions

- Apache HTTPD - used as CDN

- Apache HTTPD - used as frontend node and reverse proxy to backend systems

### Automated build instructions (Test)

__All the scripts are available in test-app folder__

Windows:
```console
  build.bat
```
Unix:
```console
  .\build.sh
```

### Running application

After build is completed, start the application using automatic start script:

Windows:
```console
  start.bat
```
Unix:
```console
  .\start.sh
```

Stop the application using automatic stop script:

Windows:
```console
  stop.bat
```
Unix:
```console
  .\stop.sh
```

### Testing the build (Test)

Confirm that the application is working fine, by going to:

  http://localhost

You can also access database directly:

  http://localhost/adminer

Login using testappuser/TestUserPassword credentials, open database testdb and query some tables - data should be selected correctly.

# Banking Application

This is the final application to be used during the hackathon event, consisting of the following modules:

- node.js express server - used as a REST API

- MySQL Database - used as a main database

- Adminer - database administration tool

- Redis storage - used as a storage of sessions

- Apache HTTPD - used as CDN

- Apache HTTPD - used as frontend node and reverse proxy to backend systems

### Automated build instructions (Bank)

__All the scripts are available in app folder__

Windows:
```console
  build.bat
```
Unix:
```console
  .\build.sh
```

### Running application

After build is completed, start the application using automatic start script:

Windows:
```console
  start.bat
```
Unix:
```console
  .\start.sh
```

Stop the application using automatic stop script:

Windows:
```console
  stop.bat
```
Unix:
```console
  .\stop.sh
```

### Testing the build (Bank)

Confirm that the application is working fine, by going to:

  http://localhost

You can also access database directly:

  http://localhost/adminer

Login using bankappuser/AppUserPassword credentials, open database testdb and query some tables - data should be selected correctly.

Test the API by opening the following URL:

  http://localhost/api/v1/customers

You can also retrieve specific customer data using direct URL:

  http://localhost/api/v1/customers/2241

  http://localhost/api/v1/customers/2242

  http://localhost/api/v1/customers/2242/accounts

  http://localhost/api/v1/accounts/86436

  http://localhost/api/v1/accounts/86436/transactions

  http://localhost/api/v1/transactions/12316133

### How to play with that?

Log in using customer ID and password: 2241/password.

You should be redirected to accounts list. Click on the accounts to preview the balance.

