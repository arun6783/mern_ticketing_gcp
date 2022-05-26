import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@sanguinee06-justix/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
