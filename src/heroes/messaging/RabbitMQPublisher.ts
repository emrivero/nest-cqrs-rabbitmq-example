import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { IEventPublisher } from '@nestjs/cqrs';

@Injectable()
export class RabbitMQPublisher implements IEventPublisher {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  connect(): void {
    // init logic if is neccesary
  }

  publish<T>(event: T): any {
    this.amqpConnection.publish(
      '',
      event.constructor.name,
      JSON.stringify(event),
    );
  }
}
