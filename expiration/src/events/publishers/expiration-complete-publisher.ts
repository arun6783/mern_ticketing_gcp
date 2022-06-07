import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from '@sanguinee06-justix/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}
