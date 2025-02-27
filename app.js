import express from 'express';
import router from './routes/index.js';

const app = express();

app.use(function (req, res, next) {
	res.header("Content-Type",'application/json');
	next();
});

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});