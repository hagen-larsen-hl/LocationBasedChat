import { useContext, useEffect, useState, useRef } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { Link, Route, Routes } from 'react-router-dom';
import { Rooms } from './rooms';
import { Room } from './room';
import { ChatRoom } from '../chat_room/_chat_room';
import { NewRoomModal } from './new_room_modal';
import { Map } from './map';

export const Home = () => {
  const api = useContext(ApiContext);
  // const navigate = useNavigate();

  const [chatRooms, setChatRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const updatesRef = useRef([]);

  useEffect(async () => {
    const res = await api.get('/users/me');
    const { chatRooms } = await api.get('/chat_rooms');
    console.log(chatRooms);
    setChatRooms(chatRooms);
    setUser(res.user);
    setLoading(false);
  }, []);

  useEffect(async () => {
    const watch = navigator.geolocation.getCurrentPosition((location) => {
      console.log('location', location);
      setLocation(location);
    });

    return () => {
      navigator.geolocation.clearWatch(watch);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }


  const createRoom = async (name) => {
    setIsOpen(false);
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    const { chatRoom } = await api.post('/chat_rooms', { name, longitude, latitude });
    setChatRooms([...chatRooms, chatRoom]);
    window.location.href = "/#/chat_rooms/" + chatRoom.id;
  };

  return (
    <>
      <Map chatRooms={chatRooms} />
      <div>
      <Room action={() => setIsOpen(true)}>New Room</Room>
        <Routes>
          <Route path="chat_rooms/:id" element={<ChatRoom />} />
          <Route path="/*" element={<div className="sub-header">Select a room to get started</div>} />
        </Routes>
      </div>
      {isOpen ? <NewRoomModal createRoom={createRoom} /> : null}
    </>
  );
};
