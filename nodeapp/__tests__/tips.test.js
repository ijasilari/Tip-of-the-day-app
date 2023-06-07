import pg from "pg";
import * as dotenv from "dotenv";
import { expect, beforeAll, afterAll } from "@jest/globals";
import supertest from "supertest";
import app from "../app.js";
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
  password: "",
};

const loggedInUser2 = {
  userId: "",
  email: "",
  token: "",
};

const loggedInAdmin = {
  userId: "",
  email: "",
  token: "",
  role: "admin",
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
    role: "guest",
  };

  const data2 = {
    username: "Testaaja",
    email: "testaaja@gmail.com",
    password: "password123",
    role: "guest",
  };

  const data3 = {
    username: "admin",
    email: "admin@gmail.com",
    password: "adminadmin",
    role: "admin",
  };
  const response = await supertest(app)
    .post("/api/users/signup")
    .set("Accept", "application/json")
    .send(data);
  loggedInUser.userId = response.body.id;
  loggedInUser.email = response.body.email;
  loggedInUser.token = response.body.token;

  const response2 = await supertest(app)
    .post("/api/users/signup")
    .set("Accept", "application/json")
    .send(data2);
  loggedInUser2.userId = response2.body.id;
  loggedInUser2.email = response2.body.email;
  loggedInUser2.token = response2.body.token;

  const response3 = await supertest(app)
    .post("/api/users/signup")
    .set("Accept", "application/json")
    .send(data3);
  loggedInAdmin.userId = response3.body.id;
  loggedInAdmin.email = response3.body.email;
  loggedInAdmin.token = response3.body.token;
});

afterAll(() => pool.end());

describe("TOTD tests", () => {
  let TipId = "";

  it("POST /addtip", async () => {
    const tip = {
      description: "Test Tip",
      category: 1,
      creator: loggedInUser.userId,
    };

    const response = await supertest(app)
      .post("/api/tips/addtip")
      .set("Authorization", "Bearer " + loggedInUser.token)
      .set("Accept", "application/json")
      .send(tip);
    expect(response.status).toEqual(201);
    expect(response.body.Tip.description).toEqual("Test Tip");
    TipId = response.body.id;
  });

  it("PATCH /:tid/like add like to tip", async () => {
    const tip = {
      userId: loggedInUser.userId,
      vote: 1,
    };

    const response = await supertest(app)
      .patch(`/api/tips/${TipId}/like`)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .set("Accept", "application/json")
      .send(tip);
    expect(response.status).toEqual(200);
    expect(response.body.tip.wholiked).toEqual(loggedInUser.userId);
    expect(response.body.tip.likes).toEqual(1);
  });

  it("PATCH /:tid/like try to add like to tip with wrong id", async () => {
    const tip = {
      userId: loggedInUser.userId,
      vote: 1,
    };

    const response = await supertest(app)
      .patch(`/api/tips/123456789/like`)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .set("Accept", "application/json")
      .send(tip);
    expect(response.status).toEqual(404);
    expect(response.error.text).toContain("Tip with ID 123456789 not found");
  });

  it("PATCH /:tid/like try to add like to tip which user has already voted on", async () => {
    const tip = {
      userId: loggedInUser.userId,
      vote: 1,
    };

    const response = await supertest(app)
      .patch(`/api/tips/${TipId}/like`)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .set("Accept", "application/json")
      .send(tip);
    expect(response.status).toEqual(400);
    expect(response.error.text).toContain("You have already voted on this tip");
  });

  it("PATCH /:tid/like try to add like to tip without proper autentication", async () => {
    const tip = {
      userId: loggedInUser.userId,
      vote: 1,
    };

    const response = await supertest(app)
      .patch(`/api/tips/${TipId}/like`)
      .set("Accept", "application/json")
      .send(tip);
    expect(response.status).toEqual(401);
    expect(response.error.text).toContain("Authentication failed");
  });

  it("GET /getall", async () => {
    await supertest(app)
      .get("/api/tips/getall")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.tips)).toBeTruthy();
      });
  });

  it("GET /:tipId", async () => {
    const response = await supertest(app).get(`/api/tips/${TipId}`);
    expect(response.body.tip.id).toEqual(TipId);
  });

  it("GET /:tipId/plain", async () => {
    const response = await supertest(app).get("/api/tips/12345/plain");
    expect(response.body).toBeTruthy();
  });

  it("GET /getall/:category", async () => {
    const response = await supertest(app).get(`/api/tips/getall/1`);
    expect(response.body.tips[0].category).toEqual(1);
  });

  it("GET /getall/:category with invalid category", async () => {
    const response = await supertest(app).get(`/api/tips/getall/123`);
    expect(response.status).toEqual(404);
    expect(response.error.text).toContain("Tip with CATEGORY 123 not found");
  });

  it("GET /getbycreator/:creator", async () => {
    const response = await supertest(app).get(
      `/api/tips/getbycreator/${loggedInUser.userId}`
    );
    expect(response.body.tips[0].creator).toEqual(loggedInUser.userId);
  });

  it("GET /getbycreator/:creator with invalid creatorId", async () => {
    const response = await supertest(app).get(`/api/tips/getbycreator/123456`);
    expect(response.status).toEqual(404);
    expect(response.error.text).toContain("Tip with CREATOR 123456 not found");
  });

  it("GET /randomtip", async () => {
    const response = await supertest(app).get(`/api/tips/randomtip`);
    expect(response.body.tip.description).toEqual("Test Tip");
  });

  it("PATCH /:tipId/update with another user should throw authentication error", async () => {
    const tip = {
      description: "Update Test Tip",
      category: 2,
      creator: loggedInUser2.userId,
    };
    const response = await supertest(app)
      .patch(`/api/tips/${TipId}/update`)
      .set("Authorization", "Bearer " + loggedInUser2.token)
      .set("Accept", "application/json")
      .send(tip);
    expect(response.status).toEqual(401);
    expect(response.error.text).toContain("Not authorized to update tip");
  });

  it("PATCH /:tipId/update", async () => {
    const tip = {
      description: "Update Test Tip",
      category: 2,
      creator: loggedInUser.userId,
    };
    const response = await supertest(app)
      .patch(`/api/tips/${TipId}/update`)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .set("Accept", "application/json")
      .send(tip);
    expect(response.status).toEqual(200);
    expect(response.body.tip.description).toEqual("Update Test Tip");
    expect(response.body.tip.category).toEqual(2);
  });

  it("POST /addtip without token", async () => {
    const tip = {
      description: "New Test Tip",
      category: 1,
      creator: loggedInUser.userId,
    };

    const response = await supertest(app)
      .post("/api/tips/addtip")
      .set("Accept", "application/json")
      .send(tip);
    expect(response.status).toEqual(401);
    expect(response.text).toEqual("Authentication failed");
  });

  it("PATCH /:tipId/update without token", async () => {
    const tip = {
      description: "Update Test Tip",
      category: 2,
      creator: loggedInUser.userId,
    };
    const response = await supertest(app)
      .patch(`/api/tips/${TipId}/update`)
      .set("Accept", "application/json")
      .send(tip);
    expect(response.status).toEqual(401);
    expect(response.text).toEqual("Authentication failed");
  });

  it("DELETE /:tipId/delete without token", async () => {
    const response = await supertest(app)
      .delete(`/api/tips/${TipId}/delete`)
      .set("Accept", "application/json");
    expect(response.status).toEqual(401);
    expect(response.text).toEqual("Authentication failed");
  });

  it("DELETE /:tipId/delete with another user should throw authentication error", async () => {
    const response = await supertest(app)
      .delete(`/api/tips/${TipId}/delete`)
      .set("Authorization", "Bearer " + loggedInUser2.token)
      .set("Accept", "application/json");
    expect(response.status).toEqual(401);
    expect(response.error.text).toContain("Not authorized to delete tip");
  });

  it("DELETE /:tipId/delete", async () => {
    const response = await supertest(app)
      .delete(`/api/tips/${TipId}/delete`)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .set("Accept", "application/json");
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual("Deleted the tip.");
  });

  it("GET /:tipId with faulty id", async () => {
    const tipId = 100;
    const response = await supertest(app).get(`/api/tips/${tipId}`);
    expect(response.status).toEqual(404);
    expect(response.error.text).toContain("Tip with ID 100 not found");
  });

  it("POST /addtip without description", async () => {
    const tip = {
      description: "",
      category: 2,
      creator: loggedInUser.userId,
    };

    const response = await supertest(app)
      .post("/api/tips/addtip")
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
      description: "",
      creator: loggedInUser.userId,
    };

    const response = await supertest(app)
      .post("/api/tips/addtip")
      .set("Authorization", "Bearer " + loggedInUser.token)
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
      category: 2,
      creator: loggedInUser.userId,
    };
    const response = await supertest(app)
      .patch(`/api/tips/1234567/update`)
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
      creator: loggedInUser.userId,
    };
    const response = await supertest(app)
      .patch(`/api/tips/${TipId}/update`)
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
      description: "new tip",
      creator: loggedInUser.userId,
    };
    const response = await supertest(app)
      .patch(`/api/tips/${TipId}/update`)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .set("Accept", "application/json")
      .send(tip);
    expect(response.status).toEqual(400);
    expect(response.error.text).toContain(
      "Invalid values given check the data"
    );
  });

  it("DELETE /:tipId/delete with faulty id", async () => {
    const response = await supertest(app)
      .delete(`/api/tips/123456789/delete`)
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
      .post("/api/users/login")
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
      .post("/api/users/login")
      .set("Accept", "application/json")
      .send(data);
    expect(response.status).toEqual(401);
    expect(response.text).toEqual("No valid password, check your credentials");
  });

  it("POST /login with wrong email", async () => {
    const data = {
      email: "taunotestaaja123@gmail.com",
      password: "password123",
    };

    const response = await supertest(app)
      .post("/api/users/login")
      .set("Accept", "application/json")
      .send(data);
    expect(response.status).toEqual(401);
    expect(response.text).toEqual("No user found, check your credentials");
  });

  it("POST /signup with invalid name length", async () => {
    const data = {
      username: "",
      email: "taunotestaaja@gmail.com",
      password: "password123",
    };
    const response = await supertest(app)
      .post("/api/users/signup")
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
      .post("/api/users/signup")
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
      .post("/api/users/signup")
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
      role: "guest",
    };
    const response = await supertest(app)
      .post("/api/users/signup")
      .set("Accept", "application/json")
      .send(data);
    expect(response.status).toEqual(422);
    expect(response.text).toEqual("Could not create user, user exists");
  });

  it("GET /getusers", async () => {
    const response = await supertest(app).get(`/api/users/getusers`);
    expect(response.status).toEqual(200);
    expect(response.body[0].id).toBeTruthy();
    expect(response.body[0].email).toBeTruthy();
    expect(response.body[0].username).toBeTruthy();
  });

  it("GET /:uid", async () => {
    const response = await supertest(app).get(
      `/api/users/${loggedInUser.userId}`
    );
    expect(response.status).toEqual(200);
    expect(response.body.user.id).toBeTruthy();
    expect(response.body.user.email).toBeTruthy();
    expect(response.body.user.username).toBeTruthy();
  });

  it("GET /:uid with faulty userId", async () => {
    const response = await supertest(app).get(`/api/users/123456`);
    expect(response.status).toEqual(404);
    expect(response.error.text).toContain("User with ID 123456 not found");
  });

  it("GET /api/invalid", async () => {
    const response = await supertest(app).get("/api/invalid");
    expect(response.status).toEqual(404);
    expect(response.text).toEqual('{"message":"Route not found"}');
  });

  it("PATCH /:userId/update change name of the user, email and password with faulty id", async () => {
    const data = {
      username: "Tahvo Testaaja",
      email: "tahvotestaaja@gmail.com",
      password: "password123",
      role: "guest",
    };

    const response = await supertest(app)
      .patch(`/api/users/123456789/update`)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .set("Accept", "application/json")
      .send(data);
    expect(response.status).toEqual(404);
    expect(response.error.text).toContain("User with ID 123456789 not found");
  });

  it("PATCH /:userId/update should throw authentication error when trying to change another user values", async () => {
    const data = {
      username: "newuser",
      email: "newuser@gmail.com",
      password: "newuser12345",
      role: "guest",
    };

    const response = await supertest(app)
      .patch(`/api/users/${loggedInUser.userId}/update`)
      .set("Authorization", "Bearer " + loggedInUser2.token)
      .set("Accept", "application/json")
      .send(data);
    expect(response.status).toEqual(401);
    expect(response.error.text).toContain("Not authorized to update user");
  });

  it("PATCH /:userId/update change name of the user, email and password", async () => {
    const data = {
      username: "Tahvo Testaaja",
      email: "tahvotestaaja@gmail.com",
      password: "password12345",
      role: "guest",
    };

    const response = await supertest(app)
      .patch(`/api/users/${loggedInUser.userId}/update`)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .set("Accept", "application/json")
      .send(data);
    expect(response.status).toEqual(200);
    expect(response.body.user.username).toEqual("Tahvo Testaaja");
    expect(response.body.user.email).toEqual("tahvotestaaja@gmail.com");
    loggedInUser.password = response.body.user.password;
  });

  it("PATCH /:userId/update update values to same as they were should succeed", async () => {
    const data = {
      username: "Tahvo Testaaja",
      email: "tahvotestaaja@gmail.com",
      password: loggedInUser.password,
      role: "guest",
    };

    const response = await supertest(app)
      .patch(`/api/users/${loggedInUser.userId}/update`)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .set("Accept", "application/json")
      .send(data);
    expect(response.status).toEqual(200);
    expect(response.body.user.username).toEqual("Tahvo Testaaja");
    expect(response.body.user.email).toEqual("tahvotestaaja@gmail.com");
  });

  it("POST /login with new changed values", async () => {
    const data = {
      email: "tahvotestaaja@gmail.com",
      password: "password12345",
    };

    const response = await supertest(app)
      .post("/api/users/login")
      .set("Accept", "application/json")
      .send(data);
    expect(response.status).toEqual(201);
    expect(response.body.email).toEqual("tahvotestaaja@gmail.com");
    expect(response.body.token).toBeTruthy();
    expect(response.body.id).toBeTruthy();
  });

  it("PATCH /:userId/update change email to same as other user email", async () => {
    const data = {
      username: "Tahvo Testaaja",
      email: "testaaja@gmail.com",
      password: "password12345",
      role: "guest",
    };

    const response = await supertest(app)
      .patch(`/api/users/${loggedInUser.userId}/update`)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .set("Accept", "application/json")
      .send(data);
    expect(response.status).toEqual(422);
    expect(response.error.text).toContain("Email exists");
  });

  it("PATCH /:userId/update change name of the user with empty value", async () => {
    const data = {
      username: "",
      email: "test@email.com",
      password: "password12345",
    };

    const response = await supertest(app)
      .patch(`/api/users/${loggedInUser.userId}/update`)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .set("Accept", "application/json")
      .send(data);
    expect(response.status).toEqual(400);
    expect(response.text).toContain('"username" is not allowed to be empty');
  });

  it("PATCH /:userId/update change email of the user with empty value", async () => {
    const data = {
      username: "testuser",
      email: "",
      password: "password12345",
    };

    const response = await supertest(app)
      .patch(`/api/users/${loggedInUser.userId}/update`)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .set("Accept", "application/json")
      .send(data);
    expect(response.status).toEqual(400);
    expect(response.text).toContain('"email" is not allowed to be empty');
  });

  it("PATCH /:userId/update change password of the user with empty value", async () => {
    const data = {
      username: "testuser",
      email: "test@email.com",
      password: "",
    };

    const response = await supertest(app)
      .patch(`/api/users/${loggedInUser.userId}/update`)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .set("Accept", "application/json")
      .send(data);
    expect(response.status).toEqual(400);
    expect(response.text).toContain('"password" is not allowed to be empty');
  });

  it("DELETE /:userId/delete trying to delete another user should throw authentication error", async () => {
    const response = await supertest(app)
      .delete(`/api/users/${loggedInUser.userId}/delete`)
      .set("Authorization", "Bearer " + loggedInUser2.token)
      .set("Accept", "application/json");
    expect(response.status).toEqual(401);
    expect(response.text).toContain("Not authorized to delete user");
  });

  it("DELETE /:userId/delete delete user", async () => {
    const response = await supertest(app)
      .delete(`/api/users/${loggedInUser.userId}/delete`)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .set("Accept", "application/json");
    expect(response.status).toEqual(200);
    expect(response.text).toEqual('{"message":"Deleted the user."}');
  });

  it("DELETE /:userId/delete try to delete user with wrong id", async () => {
    const response = await supertest(app)
      .delete("/api/users/abcdefg123456789/delete")
      .set("Authorization", "Bearer " + loggedInUser.token)
      .set("Accept", "application/json");
    expect(response.status).toEqual(404);
    expect(response.error.text).toContain(
      "User with ID abcdefg123456789 not found"
    );
  });

  it("DELETE /:userId/delete try to delete user without token", async () => {
    const response = await supertest(app)
      .delete(`/api/users/${loggedInUser2.userId}/delete`)
      .set("Accept", "application/json");
    expect(response.status).toEqual(401);
    expect(response.text).toEqual("Authentication failed");
  });

  it("PATCH /:userId/update try to modify another user details as admin", async () => {
    const data = {
      username: "testuser",
      email: "testuser@gmail.com",
      password: "testuser123",
      role: "admin",
    };

    const response = await supertest(app)
      .patch(`/api/users/${loggedInUser2.userId}/update`)
      .set("Authorization", "Bearer " + loggedInAdmin.token)
      .set("Accept", "application/json")
      .send(data);
    expect(response.status).toEqual(200);
    expect(response.body.user.email).toEqual("testuser@gmail.com");
    expect(response.body.user.username).toEqual("testuser");
    expect(response.body.user.role).toEqual("admin");
  });

  it("POST /login as new admin", async () => {
    const data = {
      email: "testuser@gmail.com",
      password: "testuser123",
    };

    const response = await supertest(app)
      .post("/api/users/login")
      .set("Accept", "application/json")
      .send(data);
    expect(response.status).toEqual(201);
    expect(response.body.email).toEqual("testuser@gmail.com");
    expect(response.body.token).toBeTruthy();
    expect(response.body.id).toBeTruthy();
    expect(response.body.role).toEqual("admin");
  });

  it("DELETE /:userId/delete try to delete user as admin", async () => {
    const response = await supertest(app)
      .delete(`/api/users/${loggedInUser2.userId}/delete`)
      .set("Authorization", "Bearer " + loggedInAdmin.token)
      .set("Accept", "application/json");
    expect(response.status).toEqual(200);
    expect(response.text).toEqual('{"message":"Deleted the user."}');
  });

  it("DELETE /:userId/delete deleting admin", async () => {
    const response = await supertest(app)
      .delete(`/api/users/${loggedInAdmin.userId}/delete`)
      .set("Authorization", "Bearer " + loggedInAdmin.token)
      .set("Accept", "application/json");
    expect(response.status).toEqual(200);
    expect(response.text).toEqual('{"message":"Deleted the user."}');
  });
});
