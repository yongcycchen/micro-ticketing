import { Publisher, Subjects, TicketCreatedEvent } from "@cyctickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
