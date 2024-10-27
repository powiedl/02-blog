const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  const comments = commentsByPostId[req.params.id] || [];
  res.send(comments);
});

app.post('/posts/:id/comments', async (req, res) => {
  console.log('creating comment', req.body); // log comment in console
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: 'pending' });

  commentsByPostId[req.params.id] = comments; // store in memory

  axios
    .post('http://events-srv:4005/events', {
      type: 'CommentCreated',
      data: {
        id: commentId,
        content,
        publicContent: '',
        postId: req.params.id,
        status: 'pending',
      },
    })
    .catch((err) => console.log(err));

  res.status(201).send(comments); // 201 = created
});

app.post('/events', (req, res) => {
  console.log('Comments - received event', req.body?.type);
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { id, postId, status, content, publicContent } = data;

    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    if (status === 'approved') {
      comment.publicContent = content;
    } else {
      comment.publicContent = '';
    }

    axios
      .post('http://events-srv:4005/events', {
        type: 'CommentUpdated',
        data: {
          id,
          postId,
          status,
          content,
          publicContent: comment.publicContent,
        },
      })
      .catch((err) => console.log(err));
  }
  res.send({});
});

app.listen(4001, () => {
  console.log('Comments - Listening on 4001 (really)');
});
