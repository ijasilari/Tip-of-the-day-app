import { getAllTips, findTipById, addTip, updateTipWithId, deleteTipWithId } from "../models/tips.js";
import { validationResult } from "express-validator";

const getTips = async (req, res, next) => {
  const tips = await getAllTips();
  // console.log(tips)
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

  const { description } = req.body;
  // console.log(req.body)
  // console.log(description)

  const newTip = {
    description: description
  };

  const result = await addTip(newTip);
  if (!result) {
    const error = new Error(`Something went wrong when adding new tip`);
    error.statusCode = 500;
    return next(error);
  }

  res.status(201).json({
    description: newTip.description
  });
};

const updateTipById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(`Invalid values given check the data`);
    error.statusCode = 400;
    return next(error);
  }

  const { description } = req.body;
  const tipId = req.params.tid;
  // console.log(tipId)
  const tip = await findTipById(tipId);

  if (!tip) {
    const error = new Error(`Tip with ID ${tipId} not found`);
    error.statusCode = 404;
    return next(error);
  }
    const result = await updateTipWithId(
      description,
      tipId
    );

    if (!result) {
    const error = new Error(`Couldnt update Tip with ID ${tipId}`);
    error.statusCode = 404;
    return next(error);
    }

    tip.id = tipId
    tip.description = description
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

  const result = await deleteTipWithId(tipId);
  if (!result) {
    const error = new Error(`Tip with ID ${tipId} couldnt be deleted`);
    error.statusCode = 404;
    return next(error);
  }
  res.status(200).json({ message: "Deleted the tip." });
};

export {
  getTips,
  deleteTipById,
  updateTipById,
  getTipById,
  addNewTip,
  getTipByIdPlainText
};