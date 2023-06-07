import pg from "pg";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import bcrypt from "bcryptjs";
const hashedPassword = bcrypt.hashSync("admin", 12);

const admin = {
  id: "1",
  username: "admin",
  email: "admin@gmail.com",
  password: hashedPassword,
  role: "admin",
};

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

pool
  .query(
    "INSERT INTO public.users (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5 ) ON CONFLICT (id) DO NOTHING",
    [admin.id, admin.username, admin.email, admin.password, admin.role]
  )
  .catch((err) => console.log(err));
