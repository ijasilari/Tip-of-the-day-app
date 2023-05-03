import { getTips, deleteTipById, updateTipById, getTipById, addNewTip, getTipByIdPlainText } from './controllers/tips.js';
import express from "express";
import bodyParser from "body-parser";
import { check } from "express-validator";
import cors from "cors";
// const express = require('express')
const app = express()
const port = 3000
app.use(cors());
// var dt = require('./modules/totd.js')


// app.use('/public', express.static(path.join(__dirname, 'public')))
function handleHttpError(err, req, res, next) {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
}
app.use(handleHttpError);
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})
app.use('/public', express.static('public'))
/*
app.get('/', (req, res) => {
	res.send('Hello Express! Use the /totd/<nr> to fetch tips')
})

app.get('/totd/:id', (req, res) => {
	// console.log(req)
	res.send(dt.readTip(req.params['id']) + "\n")
})

// Populate data structures for delivering the tips files
dt.scanAllFiles();
*/
/*
** These are for testing only at this point:
*/
/*
app.get('/file/:name', (req, res) => {
	res.send(dt.readFile(req.params['name']) + "\n")
})
app.get('/time', (req, res) => {
	res.send("Current date and time (according to node) is \n" + dt.myDateTime() + "\n")
})
app.get('/api/*', (req, res) => {
	res.send('Hello Express Any!'+req.path)
})
*/
// version 2 below

app.get("/getall", getTips);
app.delete("/:tid/delete", deleteTipById);
app.patch(
  "/:tid/update",
  [
    check("description")
      .notEmpty()
  ],
  updateTipById
);
app.get("/:tid", getTipById);
app.get("/:tid/plain", getTipByIdPlainText);
app.post(
  "/addtip",
  [
    check("description").notEmpty()
  ],
  addNewTip
);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
