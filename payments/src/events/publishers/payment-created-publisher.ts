import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@sanguinee06-justix/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}
