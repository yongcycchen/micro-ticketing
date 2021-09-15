import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import jwt from "jsonwebtoken";

let mongo: any;
jest.mock("../nats-wrapper");
process.env.STRIPE_KEY =
  "sk_test_51JZ9jjG0VpV6YP0oMTYOtMMJVvAycJByaXvcpwEm8voNMtwZOjnp0EwU5GWkkFYUpPNCz8MEehp4pVI6juqM11Ym00ZHQ3fEIS";
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

export const authsignin = (id?: string) => {
  // Build a JWT paylod. {id,email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build session Objest{jwt:My_jwt}
  const session = { jwt: token };
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a stirng thats the cookie with encode data
  return [`express:sess=${base64}`];
};
