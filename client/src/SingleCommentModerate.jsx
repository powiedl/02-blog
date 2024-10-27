import axios from 'axios';
const SingleCommentModerate = ({ postId, id, content }) => {
  const handleModeration = async (e) => {
    console.log(id, e.target.name);
    e.preventDefault();
    const url = `http://powiedl-blog.com/posts/${postId}/comments/${id}/moderate`;
    try {
      const res = await axios.patch(url, {
        status: e.target.name,
        content,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <li>
      {content}
      <button name='approved' onClick={handleModeration}>
        &#x1F44D;
      </button>
      <button name='rejected' onClick={handleModeration}>
        &#x1F44E;
      </button>
    </li>
  );
};
export default SingleCommentModerate;
