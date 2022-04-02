export const Message = ({ message }) => {
  return (
    <div className="message">
      <p className="contents">{message.contents}</p>
      <p className="user-name">{message.userName}</p>
    </div>
  );
};
