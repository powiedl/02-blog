import CommentModerate from './CommentModerate';
import PostCreate from './PostCreate';
import PostList from './PostList';

const App = () => {
  return (
    <div className='container mt-3'>
      <h1>Create Post</h1>
      <PostCreate />
      <hr />
      <h1>Posts</h1>
      <PostList />
      <CommentModerate />
    </div>
  );
};
export default App;
