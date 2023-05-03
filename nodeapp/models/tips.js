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

const getAllTips = async () => {
  const tips = await pool.query("SELECT * FROM tips ORDER BY id");
  // console.log(tips)
  return tips.rows;
};

const findTipById = async (id) => {
  const tip = await pool.query("SELECT * FROM tips WHERE id=$1", [id]);
  return tip.rows[0];
};

const addTip = async (tip) => {
  const result = await pool.query(
    "INSERT INTO tips (description) VALUES ($1)",
    [tip.description]
  );
  // console.log(result)
  return result.rows;
};

const updateTipWithId = async (description, id) => {
  const result = await pool.query(
    "UPDATE tips SET description=$1 WHERE id=$2",
    [description, id]
  );
  return result.rowCount !== 0;
};

const deleteTipWithId = async (id) => {
  const result = await pool.query("DELETE FROM tips WHERE id=$1", [id]);
  // console.log(result)
  return result.rowCount !== 0;
};

export { getAllTips, findTipById, addTip, updateTipWithId, deleteTipWithId, };
