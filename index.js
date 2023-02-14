const express = require('express')
const app = express()

const conf = require('dotenv').config().parsed;

console.log(conf);

const port = conf.HTTPPORT;

app.get('/', (req, res) => {
  res.send('Olá Mundo doido!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})