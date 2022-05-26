import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@sanguinee06-justix/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
