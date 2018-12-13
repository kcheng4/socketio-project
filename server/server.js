const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname,'../public');
console.log(__dirname+'/../public');
console.log(publicPath);

add var port = process.env.PORT || 3000;

var app = express();

app.use(express.static(publicPath));

app.listen(port,() => {
  console.log('Server is up and running on port 3000');
})
