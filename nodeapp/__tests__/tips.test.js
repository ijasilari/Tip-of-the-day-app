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

beforeAll(async () => {
  await pool.query("BEGIN");
  await pool.query("TRUNCATE TABLE tips CASCADE");
  await pool.query("COMMIT");
});

afterAll(() => pool.end());

describe('Tips tests', () => {
  let TipId = "";

  it("POST /addtip", async () => {
    const tip = {
      description: "Test Tip",
    };

    const response = await supertest(app)
      .post("/addtip")
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

it("PATCH /:tipId/update", async () => {
  const tip = {
    description: "Update Test Tip",
  };
  const response = await supertest(app)
    .patch(`/${TipId}/update`)
    .set("Accept", "application/json")
    .send(tip);
  expect(response.status).toEqual(200);
  expect(response.body.tip.description).toEqual('Update Test Tip');
});

it("DELETE /:tipId/delete", async () => {
  const response = await supertest(app)
    .delete(`/${TipId}/delete`)
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
  };

  const response = await supertest(app)
    .post("/addtip")
    .set("Accept", "application/json")
    .send(tip);
  expect(response.status).toEqual(400);
  expect(response.error.text).toContain(
    "Invalid values given check the data"
  );
});

it("PATCH /:tipId/update with faulty id", async () => {
  const tip = {
    description: "Update Test Tip!",
  };
  const response = await supertest(app)
    .patch(`/1234567/update`)
    .set("Accept", "application/json")
    .send(tip);
  expect(response.status).toEqual(404);
  expect(response.error.text).toContain("Tip with ID 1234567 not found");
});

it("PATCH /:tipId/update without description", async () => {
  const tip = {
    description: "",
  };
  const response = await supertest(app)
    .patch(`/${TipId}/update`)
    .set("Accept", "application/json")
    .send(tip);
  expect(response.status).toEqual(400);
  expect(response.error.text).toContain(
    "Invalid values given check the data"
  );
});

it("DELETE /:tipId/delete with faulty id", async () => {
  const response = await supertest(app)
    .delete(`/123456789/delete`)
    .set("Accept", "application/json");
  expect(response.status).toEqual(404);
  expect(response.error.text).toContain("Tip with ID 123456789 not found");
});

})
