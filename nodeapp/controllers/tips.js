import {getAllTips, findTipsByCategory, findTipsByCreator, findTipById, addTip, updateTipWithId, deleteTipWithId, getRandomTip, addLikeById, removeLikeById } from "../models/tips.js";
import { validationResult } from "express-validator";

const getTips = async (req, res, next) => {
  const tips = await getAllTips();
  // console.log(tips)
  res.json({ tips });
};

const getTipsByCategory = async (req, res, next) => {
  const tipCategory = req.params.category;
  console.log(tipCategory);
  // console.log(tipId)
  const tips = await findTipsByCategory(tipCategory);
  console.log(tips)

  if (tips.length === 0) {
    const error = new Error(`Tip with CATEGORY ${tipCategory} not found`);
    error.statusCode = 404;
    return next(error);
  }

  res.json({ tips });
};

const getTipsByCreator = async (req, res, next) => {
  const creator = req.params.creator;
  console.log(creator);
  const tips = await findTipsByCreator(creator);

  if (tips.length === 0) {
    const error = new Error(`Tip with CREATOR ${creator} not found`);
    error.statusCode = 404;
    return next(error);
  }

  res.json({ tips });
};

const getTipById = async (req, res, next) => {
  const tipId = req.params.tid;
  // console.log(tipId)
  const tip = await findTipById(tipId);

  if (!tip) {
    const error = new Error(`Tip with ID ${tipId} not found`);
    error.statusCode = 404;
    return next(error);
  }

  res.json({ tip });
};

const getTipByIdPlainText = async (req, res, next) => {
  const tipId = req.params.tid;
  // console.log(tipId)
  if (tipId < 1) {
    const error = new Error(`Tip ID must be higher than 0`);
    error.statusCode = 404;
    return next(error);
  }

  const fetchData = async (id) => {
    const tip = await findTipById(id);
    // console.log(tip)

    if (!tip) {
      const newId = Math.floor(Math.random() * 100) + 1;
      const newId2 = Math.floor(Math.random() * 100) + 1;
      const remainder = newId % newId2;
      // console.log(remainder)
      fetchData(remainder);
    } else {
      res.send(tip.description);
    }
  };
  fetchData(tipId);
};

const addNewTip = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(`Invalid values given check the data`);
    error.statusCode = 400;
    return next(error);
  }

  const { category, description, creator } = req.body;
  // console.log(req.body)
  // console.log(description)

  const newTip = {
    // id,
    category: category,
    description: description,
    creator: creator
  };

  const result = await addTip(newTip);
  // console.log(result)
  if (!result) {
    const error = new Error(`Something went wrong when adding new tip`);
    error.statusCode = 500;
    return next(error);
  }

  res.status(201).json({
    Tip: newTip,
    id: result
  });
};

const updateTipById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(`Invalid values given check the data`);
    error.statusCode = 400;
    return next(error);
  }

  const { description, category, creator } = req.body;
  const tipId = req.params.tid;
  // console.log(tipId)
  console.log(category)
  const tip = await findTipById(tipId);

  if (!tip) {
    const error = new Error(`Tip with ID ${tipId} not found`);
    error.statusCode = 404;
    return next(error);
  }
  if (tip.creator !== req.userData.userId) {
    const error = new Error(`Not authorized to update tip`);
    error.statusCode = 401;
    return next(error);
  }
    const result = await updateTipWithId(
      description,
      category,
      tipId
    );

    if (!result) {
    const error = new Error(`Couldnt update Tip with ID ${tipId}`);
    error.statusCode = 404;
    return next(error);
    }

    tip.id = tipId
    tip.description = description
    tip.category = category
    tip.creator = creator
    res.status(200).json({ tip });
  };

const deleteTipById = async (req, res, next) => {
  const tipId = req.params.tid;
  // console.log(tipId)
  const tip = await findTipById(tipId);
  // console.log(tip)
  if (!tip) {
    const error = new Error(`Tip with ID ${tipId} not found`);
    error.statusCode = 404;
    return next(error);
  }

  if (tip.creator !== req.userData.userId) {
    const error = new Error(`Not authorized to delete tip`);
    error.statusCode = 401;
    return next(error);
  }

  const result = await deleteTipWithId(tipId);
  if (!result) {
    const error = new Error(`Tip with ID ${tipId} couldnt be deleted`);
    error.statusCode = 404;
    return next(error);
  }
  res.status(200).json({ message: "Deleted the tip." });
};

const getTipByRandom = async (req, res, next) => {

  const tip = await getRandomTip();
  console.log(tip)

  res.status(200).json({ tip });
};

const addLike = async (req, res, next) => {
  const tipId = req.params.tid;
  // console.log(tipId)
  const like = await addLikeById(tipId)
  console.log("this is a console log of: " + like);
  if (!like) {
    const error = new Error(`Tip with ID ${tipId} not found`);
    error.statusCode = 404;
    return next(error);
  } 

  res.json({ like });
};

const removeLike = async (req, res, next) => {
  const tipId = req.params.tid;
  // console.log(tipId)
  const like = await removeLikeById(tipId)
  console.log("this is a console log of: " + like);
  if (!like) {
    const error = new Error(`Tip with ID ${tipId} not found`);
    error.statusCode = 404;
    return next(error);
  } 

  res.json({ like });
};

export {
  getTips,
  getTipsByCategory,
  getTipsByCreator,
  deleteTipById,
  updateTipById,
  getTipById,
  addNewTip,
  getTipByIdPlainText,
  getTipByRandom,
  addLike,
  removeLike
};