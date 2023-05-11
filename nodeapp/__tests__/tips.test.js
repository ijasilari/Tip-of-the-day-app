import pg from "pg";
import * as dotenv from "dotenv";
import { expect, beforeAll, afterAll } from '@jest/globals'
import supertest from 'supertest'
import app from '../app.js'
dotenv.config({});

const devCon = {
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.DB_PORT,
};

const pool = new pg.Pool(devCon);

const loggedInUser = {
  userId: "",
  email: "",
  token: "",
};

beforeAll(async () => {
  await pool.query("BEGIN");
  await pool.query("TRUNCATE TABLE tips CASCADE");
  await pool.query("TRUNCATE TABLE users CASCADE");
  await pool.query("COMMIT");
  const data = {
    username: "Tauno Testaaja",
    email: "taunotestaaja@gmail.com",
    password: "password123",
  };
  const response = await supertest(app)
    .post("/signup")
    .set("Accept", "application/json")
    .send(data);
  loggedInUser.userId = response.body.id;
  loggedInUser.email = response.body.email;
  loggedInUser.token = response.body.token;
});

afterAll(() => pool.end());

describe('Tips tests', () => {
  let TipId = "";

  it("POST /addtip", async () => {
    const tip = {
      description: "Test Tip",
      category: 1,
    };

    const response = await supertest(app)
      .post("/addtip")
      .set("Authorization", "Bearer " + loggedInUser.token)
      .set("Accept", "application/json")
      .send(tip);
    expect(response.status).toEqual(201);
    expect(response.body.Tip.description).toEqual("Test Tip");
    TipId = response.body.id;
  });

it("GET /getall", async () => {
  await supertest(app)
    .get("/getall")
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.body.tips)).toBeTruthy();
    });
});

it("GET /:tipId", async () => {
  const response = await supertest(app)
  .get(`/${TipId}`);
  expect(response.body.tip.id).toEqual(TipId);
});

it("GET /:tipId/plain", async () => {
  const response = await supertest(app).get("/12345/plain");
  expect(response.body).toBeTruthy()
});

it("GET /getall/:category", async () => {
  const response = await supertest(app).get(`/getall/1`);
  expect(response.body.tips[0].category).toEqual(1);
});

it("GET /randomtip", async () => {
  const response = await supertest(app).get(`/randomtip`);
  expect(response.body.tip.description).toEqual('Test Tip');
});

it("PATCH /:tipId/update", async () => {
  const tip = {
    description: "Update Test Tip",
    category: 2,
  };
  const response = await supertest(app)
    .patch(`/${TipId}/update`)
    .set("Authorization", "Bearer " + loggedInUser.token)
    .set("Accept", "application/json")
    .send(tip);
  expect(response.status).toEqual(200);
  expect(response.body.tip.description).toEqual('Update Test Tip');
  expect(response.body.tip.category).toEqual(2)
});

it("POST /addtip without token", async () => {
  const tip = {
    description: "New Test Tip",
    category: 1,
  };

  const response = await supertest(app)
    .post("/addtip")
    .set("Accept", "application/json")
    .send(tip);
  expect(response.status).toEqual(401);
  expect(response.text).toEqual("Authentication failed");
});

it("PATCH /:tipId/update without token", async () => {
  const tip = {
    description: "Update Test Tip",
    category: 2,
  };
  const response = await supertest(app)
    .patch(`/${TipId}/update`)
    .set("Accept", "application/json")
    .send(tip);
  expect(response.status).toEqual(401);
  expect(response.text).toEqual("Authentication failed");
});

it("DELETE /:tipId/delete without token", async () => {
  const response = await supertest(app)
    .delete(`/${TipId}/delete`)
    .set("Accept", "application/json");
  expect(response.status).toEqual(401);
  expect(response.text).toEqual("Authentication failed");
});

it("DELETE /:tipId/delete", async () => {
  const response = await supertest(app)
    .delete(`/${TipId}/delete`)
    .set("Authorization", "Bearer " + loggedInUser.token)
    .set("Accept", "application/json");
  expect(response.status).toEqual(200);
  expect(response.body.message).toEqual("Deleted the tip.");
});

it("GET /:tipId with faulty id", async () => {
  const tipId = 100;
  const response = await supertest(app).get(`/${tipId}`);
  expect(response.status).toEqual(404)
  expect(response.error.text).toContain("Tip with ID 100 not found");
});

it("POST /addtip without description", async () => {
  const tip = {
    description: "",
    category: 2,
  };

  const response = await supertest(app)
    .post("/addtip")
    .set("Authorization", "Bearer " + loggedInUser.token)
    .set("Accept", "application/json")
    .send(tip);
  expect(response.status).toEqual(400);
  expect(response.error.text).toContain(
    "Invalid values given check the data"
  );
});

it("POST /addtip without category", async () => {
  const tip = {
    description: ""
  };

  const response = await supertest(app)
    .post("/addtip")
    .set("Authorization", "Bearer " + loggedInUser.token)
    .set("Accept", "application/json")
    .send(tip);
  expect(response.status).toEqual(400);
  expect(response.error.text).toContain("Invalid values given check the data");
});

it("PATCH /:tipId/update with faulty id", async () => {
  const tip = {
    description: "Update Test Tip!",
    category: 2,
  };
  const response = await supertest(app)
    .patch(`/1234567/update`)
    .set("Authorization", "Bearer " + loggedInUser.token)
    .set("Accept", "application/json")
    .send(tip);
  expect(response.status).toEqual(404);
  expect(response.error.text).toContain("Tip with ID 1234567 not found");
});

it("PATCH /:tipId/update without description", async () => {
  const tip = {
    description: "",
    category: 2,
  };
  const response = await supertest(app)
    .patch(`/${TipId}/update`)
    .set("Authorization", "Bearer " + loggedInUser.token)
    .set("Accept", "application/json")
    .send(tip);
  expect(response.status).toEqual(400);
  expect(response.error.text).toContain(
    "Invalid values given check the data"
  );
});

it("PATCH /:tipId/update without category", async () => {
  const tip = {
    description: "",
  };
  const response = await supertest(app)
    .patch(`/${TipId}/update`)
    .set("Authorization", "Bearer " + loggedInUser.token)
    .set("Accept", "application/json")
    .send(tip);
  expect(response.status).toEqual(400);
  expect(response.error.text).toContain("Invalid values given check the data");
});

it("DELETE /:tipId/delete with faulty id", async () => {
  const response = await supertest(app)
    .delete(`/123456789/delete`)
    .set("Authorization", "Bearer " + loggedInUser.token)
    .set("Accept", "application/json");
  expect(response.status).toEqual(404);
  expect(response.error.text).toContain("Tip with ID 123456789 not found");
});

it("POST /login", async () => {
  const data = {
    email: "taunotestaaja@gmail.com",
    password: "password123",
  };

  const response = await supertest(app)
    .post("/login")
    .set("Accept", "application/json")
    .send(data);
  expect(response.status).toEqual(201);
  expect(response.body.email).toEqual("taunotestaaja@gmail.com");
  expect(response.body.token).toBeTruthy();
  expect(response.body.id).toBeTruthy();
});

it("POST /login with wrong password", async () => {
  const data = {
    email: "taunotestaaja@gmail.com",
    password: "password123321",
  };

  const response = await supertest(app)
    .post("/login")
    .set("Accept", "application/json")
    .send(data);
  expect(response.status).toEqual(401);
  expect(response.text).toEqual(
    'No valid password, check your credentials'
  );
});

it("POST /login with wrong email", async () => {
  const data = {
    email: "taunotestaaja123@gmail.com",
    password: "password123",
  };

  const response = await supertest(app)
    .post("/login")
    .set("Accept", "application/json")
    .send(data);
  expect(response.status).toEqual(401);
  expect(response.text).toEqual(
    'No user found, check your credentials'
  );
});

it("POST /signup with invalid name length", async () => {
  const data = {
    username: "",
    email: "taunotestaaja@gmail.com",
    password: "password123",
  };
  const response = await supertest(app)
    .post("/signup")
    .set("Accept", "application/json")
    .send(data);
  expect(response.status).toEqual(400);
  expect(response.text).toEqual('"username" is not allowed to be empty');
});

it("POST /signup with invalid email", async () => {
  const data = {
    username: "Tauno Testaaja",
    email: "tauno.testaaja@gmail",
    password: "password123",
  };
  const response = await supertest(app)
    .post("/signup")
    .set("Accept", "application/json")
    .send(data);
  expect(response.status).toEqual(400);
  expect(response.text).toEqual('"email" must be a valid email');
});

it("POST /signup with invalid password", async () => {
  const data = {
    username: "Tauno Testaaja",
    email: "taunotestaaja@gmail.com",
    password: "pass",
  };
  const response = await supertest(app)
    .post("/signup")
    .set("Accept", "application/json")
    .send(data);
  expect(response.status).toEqual(400);
  expect(response.text).toEqual(
    '"password" length must be at least 8 characters long'
  );
});

it("POST /signup with existing user", async () => {
  const data = {
    username: "Tauno Testaaja",
    email: "taunotestaaja@gmail.com",
    password: "password123",
  };
  const response = await supertest(app)
    .post("/signup")
    .set("Accept", "application/json")
    .send(data);
  expect(response.status).toEqual(422);
  expect(response.text).toEqual(
    'Could not create user, user exists'
  );
});

it("GET /getusers", async () => {

  const response = await supertest(app).get(`/getusers`);
  expect(response.status).toEqual(200);
  expect(response.body[0].id).toBeTruthy();
  expect(response.body[0].email).toBeTruthy();
  expect(response.body[0].username).toBeTruthy();
});

})
