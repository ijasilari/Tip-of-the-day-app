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

const findTipsByCategory = async (category) => {
  const tip = await pool.query("SELECT * FROM tips WHERE category=$1", [category]);
  return tip.rows;
}

const addTip = async (tip) => {
  const result = await pool.query(
    "INSERT INTO tips (category, description) VALUES ($1, $2) RETURNING id",
    [tip.category, tip.description]
  );
  // console.log(result)
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
  // console.log(result)
  return result.rowCount !== 0;
};

const getRandomTip = async () => {

  const result  = await pool.query(
    "SELECT * FROM tips ORDER BY RANDOM() LIMIT 1"
  );

  return result.rows[0]
};

const addLikeById = async (id) => {
  const res = await pool.query("UPDATE tips SET likes = likes + 1 WHERE id=$1"
  [id]
  );
  console.log(res)
  return res.rows[0].likes;
}

const removeLikeById = async (id) => {
  const res = await pool.query("UPDATE tips SET likes = likes - 1 WHERE id=$1"
  [id]
  );
  // console.log(result)
  return res.rows[0].likes;
}

export { getAllTips, findTipById, findTipsByCategory, addTip, updateTipWithId, deleteTipWithId, getRandomTip, addLikeById, removeLikeById };
