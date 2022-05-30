import {
  Subjects,
  Publisher,
  OrderCancelledEvent,
} from '@sanguinee06-justix/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
