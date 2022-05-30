import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@sanguinee06-justix/common'

export class OrderCreatdPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}
