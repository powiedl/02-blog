const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.post('/posts/create', async (req, res) => {
  console.log('creating post', req.body);
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  axios
    //.post('http://localhost:4005/events', { //wenn man nicht in Kubernetes Containern arbeitet
    .post('http://events-srv:4005/events', {
      // wenn man in Kubernetes Containern arbeitet - der Name des Services ist der Hostname
      type: 'PostCreated',
      data: {
        id,
        title,
      },
    })
    .catch((err) => {
      console.log(err);
    });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Posts - received event', req.body?.type);
  res.send({});
});

app.listen(4000, () => {
  console.log('v21');
  console.log('Server running on port 4000');
});
