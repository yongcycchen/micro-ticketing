import { NotAuthorizedError, NotFoundError } from "@cyctickets/common";
import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../models/order";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.delete("/api/orders/:orderId", async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  order.status = OrderStatus.Cancelled;
  await order.save();
  res.status(204).send(order);
});

export { router as deleteOrderRouter };
