Awesome dice room
=============

This is a web site for helping me and my friends to play D&D like games. It allows a Game Master and players to roll dice, play tokens, chips, cards, whatever on a virtual table.

The project consists of two applications (for now at least): the Angular frontend, and the reactive Spring/Kotlin backend. I use WebSockets for the real time interaction between users. There are a MongoDb with reactive repositories, JWS based authorization model without sessions, Docker containers, Gradle modules with Kotlin Script and other cool things. The nearest plans are deploying this all to AWS.

I've just started so not much things has been done yet. The design is raw and ugly, I hope to come up with something better in future.

![dashboard](https://raw.githubusercontent.com/hiper2d/awesome-dice-room/master/doc/dashboard.png)

![room](https://raw.githubusercontent.com/hiper2d/awesome-dice-room/master/doc/room3.png)

### Technology stack
* Spring Framework 5 with Webflux/Reactor and Netty server
* Spring Boot 2.0
* Reactive WebSockets
* Kotlin 1.3
* Angular 7
* Gradle 5 with Kotlin Script and jUnit 5

### How to run

###### Using Docker Compose

1. Build the backend application and it's Docker image:

       ./gradlew clean build

2. Run the frontend, the backend and the database Docker containers:

       docker-compose up

   Check that it's running at http://localhost

###### Using local environment with the MongoDB in a Docker container

1. Run the MondoDB instance using a specific Docker Compose:

       docker-compose -f docker-compose-mongo.yml up
    
    It's possible to run a locally installed Mongo client with the database from the `database/data/db directory`. The backend application expects it to be run on the default `27017` port
       
2. Build and run the backend application with the `local` Spring profile:

       ./gradlew backend:{clean,build,bootRun}

    Check that it's running at http://localhost:8080/api/rooms

3. Run the frontend application on the dev webpack server:

        cd frontend
        yarn start
       
   Check that it's running at http://localhost:4200

### Prerequisites
* JRE/JDK 8+
* NodeJS
* Yarn
* Angular Cli (ng)
* Docker + Docker Compose

I didn't test it on the Windows environment. But it should work :)
