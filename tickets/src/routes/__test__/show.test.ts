import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import { authsignin } from "../../test/setup";
it("return a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`api/tickets/${id}`).send().expect(404);
});
it("return the ticket if the ticket is found", async () => {
  const title = "ajfkl";
  const price = 20;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", authsignin())
    .send({
      title,
      price,
    })
    .expect(201);
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .expect(200);
  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
