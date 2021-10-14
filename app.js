const express = require('express');
const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true
});

app.use((req, res, next) => {
  req.user = {
    _id: '6165b46e2dd28290003a10f9'
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards',require('./routes/cards'))





app.listen(PORT);



