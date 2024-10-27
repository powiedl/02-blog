const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];
const logError = (error) => {
  if (error.code) {
    console.log(
      'ERROR code',
      error.code,
      'url:',
      error?.config?.url || 'unknown'
    );
  } else if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser
    // and an instance of http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
};

app.post('/events', async (req, res) => {
  console.log('Event bus - Received Event: ', req.body);
  const event = req.body;
  events.push(event);

  axios
    //.post('http://localhost:4000/events', event)
    .post('http://posts-clusterip-srv:4000/events', event)
    .catch((err) => logError(err));
  axios
    .post('http://comments-srv:4001/events', event)
    .catch((err) => logError(err));
  axios
    .post('http://query-srv:4002/events', event)
    .catch((err) => logError(err));
  axios
    .post('http://moderation-srv:4003/events', event)
    .catch((err) => logError(err));
  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('Listening on 4005');
});
