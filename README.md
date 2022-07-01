[![Nest Logo](http://kamilmysliwiec.com/public/nest-logo.png)](http://kamilmysliwiec.com/)

[Nest](https://github.com/kamilmysliwiec/nest) framework [CQRS module](https://github.com/kamilmysliwiec/nest-cqrs) usage example.

This project uses a custom RabbitMQ event bus for usage with the CQRS module.

## Setup

To run the project, be sure to spin up the necessary RabbitMQ container using:

````
docker-compose up -d
````

Once the RabbitMQ broker is running you can start the Nest service using:

```
$ npm install
$ npm start
```

To test the end-to-end flow of the commands, events and sagas, execute the following curl command
```
 curl -X POST http://localhost:3000/hero/1234/kill
```

if everything is setup correctly, you should see the following in the Nest logs:

```
KillDragonCommand...
HeroKilledDragonEvent...
Inside [HeroesGameSagas] Saga
Async DropAncientItemCommand...
Async HeroFoundItemEvent...
```

Its also a good idea to inspect the message queue to ensure the necessary events have been
sent. This can be done using RabbitMQ UI in localhost:15672

user: admin
pass:admin

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
