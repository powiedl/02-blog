import { useEffect, useState } from 'react';
import axios from 'axios';
import SingleCommentModerate from './SingleCommentModerate';

const CommentModerate = () => {
  const [pendingComments, setPendingComments] = useState([]);
  const fetchPosts = async () => {
    const res = await axios.get('http://powiedl-blog.com/posts/moderate');
    setPendingComments(res.data);
  };
  //console.log(pendingComments);
  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <div>
      <h2>Comment Moderation</h2>
      <ul>
        {pendingComments.map((p) => (
          <li key={p.id}>
            {p.title}
            <ul>
              {p.comments.map((c) => (
                <SingleCommentModerate postId={p.id} key={c.id} {...c} />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default CommentModerate;
