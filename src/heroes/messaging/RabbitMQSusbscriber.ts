import { Inject } from '@nestjs/common';
import { IEvent, IMessageSource } from '@nestjs/cqrs';
import { Subject } from 'rxjs';

import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitMQSubscriber implements IMessageSource {
  private bridge: Subject<any>;
  constructor(
    private readonly amqpConnection: AmqpConnection,
    @Inject('EVENTS')
    private readonly events: Array<any>,
  ) {}

  connect() {
    this.events.forEach((event) => {
      this.amqpConnection.createSubscriber<string>(
        async (message) => {
          if (this.bridge) {
            const parsedJson = JSON.parse(message);
            const receivedEvent = new event(parsedJson);
            this.bridge.next(receivedEvent);
            return new Nack(false);
          }
        },
        {
          errorHandler: (channel, msg, e) => {
            throw e;
          },
          queue: event.name,
        },
        `handler_${event.name}`,
      );
    });
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    this.bridge = subject;
  }
}
