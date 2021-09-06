import { NotAuthorizedError, NotFoundError } from "@cyctickets/common";
import express, { Request, Response } from "express";
import { OrderCancelledPublisher } from "../event/publishers/order-cancelled-publisher";
import { Order, OrderStatus } from "../models/order";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete("/api/orders/:orderId", async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate("ticket");
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  order.status = OrderStatus.Cancelled;
  await order.save();
  // publishing an event saving
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id,
    },
  });
  res.status(204).send(order);
});

export { router as deleteOrderRouter };
