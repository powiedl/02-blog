const CommentList = ({ comments }) => {
  return (
    <>
      <h5>
        {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </h5>
      {comments.length > 0 && (
        <ul>
          {comments.map((c) => (
            <li key={c.id}>
              {c.status === 'approved' && c.publicContent}
              {c.status === 'rejected' && 'This comment has been rejected'}
              {c.status === 'pending' && 'This comment is awaiting moderation'}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
export default CommentList;
