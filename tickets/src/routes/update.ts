import express, { Request, response, Response } from "express";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  NotAuthorizedError,
  BadRequestError,
} from "@cyctickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/tickets";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatePublisher } from "../events/publishers/ticket-updated-publisher";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.orderId) {
      throw new BadRequestError("cannot edit a reserved ticket");
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();
    new TicketUpdatePublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.send(ticket);
  }
);

export { router as updateTicketRouter };
