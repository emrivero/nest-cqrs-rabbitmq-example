import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import clc from 'chalk';
import { HeroFoundItemEvent } from '../impl/hero-found-item.event';

@EventsHandler(HeroFoundItemEvent)
export class HeroFoundItemHandler implements IEventHandler<HeroFoundItemEvent> {
  handle(event: HeroFoundItemEvent) {
    console.log(clc.yellowBright('Async HeroFoundItemEvent...'));
  }
}
