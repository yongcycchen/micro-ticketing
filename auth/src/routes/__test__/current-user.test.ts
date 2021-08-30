import request from "supertest";
import { app } from "../../app";
import { authsignin } from "../../test/setup";

it("responds with details about the current user", async () => {
  // const authResponse = await request(app)
  //   .post("/api/users/signup")
  //   .send({ email: "test@test.com", password: "password" })
  //   .expect(201);
  // const cookie = authResponse.get("Set-Cookie");
  // const cookie = await auto.signin();
  const cookie = await authsignin();
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(response.body.currentUser.email).toEqual("test@test.com");
  //   console.log(response.body);
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);
  expect(response.body.currentUser).toEqual(null);
});
