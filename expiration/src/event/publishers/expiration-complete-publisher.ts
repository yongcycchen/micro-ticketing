import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@cyctickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
