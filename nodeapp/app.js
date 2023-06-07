import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import usersRouter from "./routes/usersroutes.js";
import tipsRouter from "./routes/tipsroutes.js";

const port = 3000;
const app = express();
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
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/public", express.static("public"));
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

app.use("/api/users", usersRouter);
app.use("/api/tips", tipsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
