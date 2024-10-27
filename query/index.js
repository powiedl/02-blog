const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};
const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  } else if (type === 'CommentCreated') {
    const { id, publicContent, postId, content, status } = data;
    const post = posts[postId];
    const comment = { id, publicContent, content, status };
    post.comments.push(comment);
  } else if (type === 'CommentUpdated') {
    const { id, publicContent, postId, content, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    comment.publicContent = publicContent;
    comment.content = content;
  }
};

app.get('/posts/moderate', (req, res) => {
  const temp = [];
  for (let pKey in posts) {
    let p = posts[pKey];
    let pPending = {
      ...p,
      comments: p.comments.filter((c) => c.status === 'pending'),
    };
    if (pPending.comments.length > 0) {
      temp.push(pPending);
    }
  }
  res.send(temp);
});

app.get('/posts', (req, res) => {
  const temp = JSON.parse(JSON.stringify(posts));
  for (let pKey in temp) {
    let p = temp[pKey];
    for (let c of p.comments) delete c.content;
  }

  res.send(temp);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log('Listening on 4002');

  try {
    const res = await axios.get('http://events-srv:4005/events');

    console.log('Query, catching up ...');
    for (let event of res.data) {
      console.log('Processing event: ', event.type);
      handleEvent(event.type, event.data);
    }
    console.log('Query, catching up complete');
  } catch (err) {
    console.log(err.message);
  }
});
