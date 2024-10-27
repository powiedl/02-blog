import axios from 'axios';
import { useEffect, useState } from 'react';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = () => {
  const [posts, setPosts] = useState({});
  const fetchPosts = async () => {
    const res = await axios.get('http://powiedl-blog.com/posts');
    setPosts(res.data);
  };
  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div
        className='card'
        key={post.id}
        style={{ width: '30%', marginBottom: '20px' }}
      >
        <div className='card-body'>
          <h3>{post.title}</h3>
          <CommentList comments={post.comments} />
          <hr />
          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className='d-flex flex-row flex-wrap justify-content-between'>
      {renderedPosts}
    </div>
  );
};
export default PostList;
