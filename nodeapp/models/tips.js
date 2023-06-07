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

const getAllTips = async () => {
  const tips = await pool.query("SELECT * FROM tips ORDER BY id DESC");
  return tips.rows;
};

const findTipById = async (id) => {
  const tip = await pool.query("SELECT * FROM tips WHERE id=$1", [id]);
  return tip.rows[0];
};

const findTipsByCategory = async (category) => {
  const tip = await pool.query("SELECT * FROM tips WHERE category=$1", [
    category,
  ]);
  return tip.rows;
};

const findTipsByCreator = async (creator) => {
  const tip = await pool.query("SELECT * FROM tips WHERE creator=$1", [
    creator,
  ]);
  return tip.rows;
};

const addTip = async (tip) => {
  const result = await pool.query(
    "INSERT INTO tips (category, description, creator) VALUES ($1, $2, $3) RETURNING id",
    [tip.category, tip.description, tip.creator]
  );
  return result.rows[0].id;
};

const updateTipWithId = async (description, category, id) => {
  const result = await pool.query(
    "UPDATE tips SET description=$1, category=$2 WHERE id=$3",
    [description, category, id]
  );
  return result.rowCount !== 0;
};

const deleteTipWithId = async (id) => {
  const result = await pool.query("DELETE FROM tips WHERE id=$1", [id]);
  return result.rowCount !== 0;
};

const getRandomTip = async () => {
  const result = await pool.query(
    "SELECT * FROM tips ORDER BY RANDOM() LIMIT 1"
  );

  return result.rows[0];
};

const addLikeById = async (userId, id, vote) => {
  const res = await pool.query(
    "UPDATE tips SET likes = likes + $3, wholiked = jsonb_set(COALESCE(wholiked, '{}'::jsonb), $1, 'true', true) WHERE id = $2",
    [[userId], id, vote]
  );
  return res.rowCount !== 0;
};

export {
  getAllTips,
  findTipById,
  findTipsByCategory,
  findTipsByCreator,
  addTip,
  updateTipWithId,
  deleteTipWithId,
  getRandomTip,
  addLikeById,
};
