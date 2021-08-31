import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import { authsignin } from "../../test/setup";
it("return a 404 if the ticket is not found", async () => {
  await request(app).get("api/tickets/alkfj").send().expect(404);
});
it("return the ticket if the ticket is found", async () => {
  const title = "ajfkl";
  const price = 20;
  await request(app)
    .post("/api/tickets")
    .set("Cookie", authsignin())
    .send({
      title,
      price,
    })
    .expect(201);
});
