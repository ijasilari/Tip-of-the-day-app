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
  findAll: () => new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users', (err, result) => {
        if(err) {
          return reject(err);
        }
        resolve(result);
      });
  }),
  create: async (user) =>  {
    console.log("models create");
    console.log(user);
    try {
        await pool.connect();
        await pool.query(
            `INSERT INTO "users" ("id", "name", "email", "password")  
             VALUES ($1, $2, $3)`, [user.id, user.name, user.email, user.password]); // sends queries
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    }
},
  findByEmail: (email) => new Promise((resolve, reject) => {
    console.log("models findbyemail");
      pool.query('SELECT * FROM users WHERE email LIKE ?;', email, (err, result) => {
        if(err) {
         reject(err);
        }else{
        console.log(result);
        resolve(result);
        }
      });
  })
};

export {users};