import { useState } from 'react';
import axios from 'axios';

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    //await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
    await axios.post(`http://powiedl-blog.com/posts/${postId}/comments`, {
      content,
    });
    setContent('');
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>New Comment</label>
          <input
            type='text'
            className='form-control'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </div>
  );
};
export default CommentCreate;
