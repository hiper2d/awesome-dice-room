Awesome dice room
=============

This is a web site for helping me and my friends to play D&D like games. It allows a Game Master and players to roll dice, play tokens, chips, cards, whatever on a virtual table.

The project consists of two applications (for now at least): the Angular frontend, and the reactive Spring/Kotlin backend. I use WebSockets for the real time interaction. In my plans to add MongoDb with the REST backend-frontend communication for saving a playing room state, a stateless Spring Security logic based on JWT for distinguishing user roles, Docker and deploy this all to AWS.

I've just started so not much things has been done yet. The design is raw and ugly, I hope to come up with something better in future.

![room](https://raw.githubusercontent.com/hiper2d/awesome-dice-room/master/doc/room.png)

##### Technology stack
* Spring Framework 5 with Webflux/Reactor and Netty server
* Spring Boot 2.0
* Reactive WebSockets
* Kotlin 1.3
* Angular 7
* Gradle 5 with Kotlin Script and jUnit 5
