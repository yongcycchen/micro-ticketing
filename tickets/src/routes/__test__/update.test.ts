import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import { authsignin } from "../../test/setup";
import { natsWrapper } from "../../nats-wrapper";

it("return a 404 if the id is does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", authsignin())
    .send({
      title: "asdflk",
      price: 20,
    })
    .expect(404);
});
it("return a 401 if the use is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "asdflk",
      price: 20,
    })
    .expect(401);
});
it("return a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", authsignin())
    .send({
      title: "asdlfkj",
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", authsignin())
    .send({
      title: "adjksj",
      price: 1000,
    })
    .expect(401);
});
it("return a 400 if the user provides an invalid title or price", async () => {
  const cookie = authsignin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asdlfkj",
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "adfasdf",
      price: -0,
    })
    .expect(400);
});
it("updates the ticket provides an incalid title or price", async () => {
  const cookie = authsignin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asdlfkj",
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "newsd",
      price: 100,
    })
    .expect(200);
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  expect(ticketResponse.body.title).toEqual("newsd");
  expect(ticketResponse.body.price).toEqual(100);
});

it("publish an event", async () => {
  const cookie = authsignin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asdlfkj",
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
