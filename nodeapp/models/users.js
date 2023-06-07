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
const prodCon = {
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new pg.Pool(
  process.env.NODE_ENV === "production" ? prodCon : devCon
);

const users = {
  findAll: () =>
    new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM users ORDER BY created_at DESC",
        (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        }
      );
    }),
  create: async (user) => {
    try {
      await pool.connect();
      await pool.query(
        `INSERT INTO "users" ("id", "username", "email", "password", "role")
             VALUES ($1, $2, $3, $4, $5)`,
        [user.id, user.username, user.email, user.password, user.role]
      ); // sends queries
      return true;
    } catch (error) {
      console.error(error.stack);
      return false;
    }
  },
  findByEmail: (email) =>
    new Promise((resolve, reject) => {
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
      pool.query("SELECT * FROM users WHERE id=$1;", [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log(result.rows);
          resolve(result.rows[0]);
        }
      });
    }),

  updateUserById: (userId, name, hashedPassword, email, role) =>
    new Promise((resolve, reject) => {
      pool.query(
        "UPDATE users SET username=$1, password=$2, email=$3, updated_at=now(), role=$4 WHERE id=$5",
        [name, hashedPassword, email, role, userId],
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

export { users };
