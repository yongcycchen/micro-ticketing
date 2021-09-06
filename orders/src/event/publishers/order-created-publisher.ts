import { OrderCreatedEvent, Publisher, Subjects } from "@cyctickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
