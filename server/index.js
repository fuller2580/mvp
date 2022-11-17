const express = require('express');
const path = require('path');
const {save, find, update, remove} = require('./db');

const app = express();

app.use(express.static(path.join(__dirname, "/../build")));
app.use(express.json());
app.use(express.urlencoded());

app.get('/image', (req, res) => {
  find(req.query['name']).then((data)=> {
    res.status(200);
    res.send(data.info);
  })
})

app.post('/image', (req, res) => {
  save(req.body).then((data)=> {
    res.status(200);
    res.end();
  })
})

app.listen(3005);