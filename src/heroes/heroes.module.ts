import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { Events } from './events/impl';
import { HeroesGameController } from './heroes.controller';
import { RabbitMQPublisher } from './messaging/RabbitMQPublisher';
import { RabbitMQSubscriber } from './messaging/RabbitMQSusbscriber';
import { QueryHandlers } from './queries/handlers';
import { HeroRepository } from './repository/hero.repository';
import { HeroesGameSagas } from './sagas/heroes.sagas';

@Module({
  imports: [
    CqrsModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: 'amqp://admin:admin@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
  ],
  controllers: [HeroesGameController],
  providers: [
    HeroRepository,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    {
      provide: 'EVENTS',
      useValue: Events,
    },
    HeroesGameSagas,
    RabbitMQPublisher,
    RabbitMQSubscriber,
  ],
})
export class HeroesGameModule implements OnModuleInit {
  constructor(
    private readonly event$: EventBus,
    private readonly rbmqPublisher: RabbitMQPublisher,
    private readonly rbmqSubscriber: RabbitMQSubscriber,
  ) {}

  async onModuleInit(): Promise<any> {
    await this.rbmqSubscriber.connect();
    this.rbmqSubscriber.bridgeEventsTo(this.event$.subject$);

    await this.rbmqPublisher.connect();
    this.event$.publisher = this.rbmqPublisher;
  }
}
