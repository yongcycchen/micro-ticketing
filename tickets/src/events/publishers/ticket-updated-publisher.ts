import { Publisher, Subjects, TicketUpdatedEvent } from "@cyctickets/common";

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
