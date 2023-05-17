import pg from "pg";
import * as dotenv from "dotenv";
dotenv.config({});

const devCon = {
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.DB_PORT,
};

const pool = new pg.Pool(devCon);

const users = {
  findAll: () =>
    new Promise((resolve, reject) => {
      pool.query("SELECT * FROM users", (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    }),
  create: async (user) => {
    console.log("models create");
    console.log(user);
    try {
      await pool.connect();
      await pool.query(
        `INSERT INTO "users" ("id", "username", "email", "password")
             VALUES ($1, $2, $3, $4)`,
        [user.id, user.username, user.email, user.password]
      ); // sends queries
      return true;
    } catch (error) {
      console.error(error.stack);
      return false;
    }
  },
  findByEmail: (email) =>
    new Promise((resolve, reject) => {
      console.log("models findbyemail");
      console.log(email);
      pool.query(
        "SELECT * FROM users WHERE email=$1;",
        [email],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log(result.rows);
            resolve(result.rows);
          }
        }
      );
    }),
  findRowCountByEmail: (email) =>
    new Promise((resolve, reject) => {
      console.log("models findrowcountbyemail");
      console.log(email);
      pool.query(
        "SELECT * FROM users WHERE email=$1;",
        [email],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log(result);
            resolve(result.rowCount !== 0);
          }
        }
      );
    }),
  findUserById: (id) =>
    new Promise((resolve, reject) => {
      console.log("models finduserbyid");
      console.log(id);
      pool.query("SELECT * FROM users WHERE id=$1;", [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log(result.rows);
          resolve(result.rows[0]);
        }
      });
    }),

  updateUserById: (userId, name, hashedPassword, email) =>
    new Promise((resolve, reject) => {
      console.log("models updateuserbyid");
      console.log(userId, name, hashedPassword, email);
      pool.query(
        "UPDATE users SET username=$1, password=$2, email=$3, updated_at=now() WHERE id=$4",
        [name, hashedPassword, email, userId],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log(result.rows);
            resolve(result.rowCount !== 0);
          }
        }
      );
    }),
  deleteUserById: (id) =>
    new Promise((resolve, reject) => {
      console.log("models deleteuserbyid");
      console.log(id);
      pool.query("DELETE FROM users WHERE id=$1", [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log(result.rows);
          resolve(result.rowCount !== 0);
        }
      });
    }),
};

export {users};