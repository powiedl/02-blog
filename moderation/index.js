const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  console.log('Moderation - Received Event: ', req.body.type);
  const { type, data } = req.body;
  if (type === 'CommentCreated') {
    if (!data.content.includes('blue')) {
      const status = data.content.includes('orange') ? 'rejected' : 'approved';
      axios
        .post('http://events-srv:4005/events', {
          type: 'CommentModerated',
          data: {
            id: data.id,
            postId: data.postId,
            status,
            content: data.content,
          },
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  res.send({});
});

app.patch('/posts/:pid/comments/:cid/moderate', async (req, res) => {
  const { pid, cid } = req.params;
  const { status, content } = req.body;
  console.log(
    'Moderation - Received moderation result: ',
    pid,
    cid,
    status,
    content
  );
  axios
    .post('http://events-srv:4005/events', {
      type: 'CommentModerated',
      data: {
        id: cid,
        postId: pid,
        status,
        content,
      },
    })
    .catch((err) => {
      console.log(err);
    });
  res.send({});
});

app.listen(4003, () => {
  console.log('Listening on 4003');
});
