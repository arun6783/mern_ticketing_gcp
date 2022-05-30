import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@sanguinee06-justix/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}
