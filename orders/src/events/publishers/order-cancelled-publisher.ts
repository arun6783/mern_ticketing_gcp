import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@sanguinee06-justix/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
