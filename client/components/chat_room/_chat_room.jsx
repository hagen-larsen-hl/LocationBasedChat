import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ApiContext } from '../../utils/api_context';

import { Button } from '../common/button';
import { useMessages } from '../../utils/use_messages';
import { Message } from './message';

export const ChatRoom = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [contents, setContents] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const api = useContext(ApiContext);
  const { id } = useParams();
  const [messages, sendMessage] = useMessages(chatRoom);
  useEffect(async () => {
    setLoading(true);
    if (!user) {
      const { user } = await api.get('/users/me');
      setUser(user);
    }
    const { chatRoom } = await api.get(`/chat_rooms/${id}`);
    setChatRoom(chatRoom);
    setLoading(false);
  }, [id]);

  const sendAndClear = (contents, user) => {
    sendMessage(contents, user);
    setContents("");
  };

  if (loading) return 'Loading...';

  return (
    <div className="chat-container">
      <div className="chatbox">
        <div className="justify-content-center">
        <h1 className="room-name">{chatRoom.name}</h1>
        </div>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <div className="chatbox flex">
        <div className="w-3/4 m-3">
          <input className="input" type="text" value={contents} onChange={(e) => setContents(e.target.value)} />
        </div>
        <div className="w-1/5 m-3">
          <Button onClick={() => sendAndClear(contents, user)}>Send</Button>
        </div>
      </div>
    </div>
  );
};
