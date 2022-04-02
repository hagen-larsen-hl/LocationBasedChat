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
    const watch = navigator.geolocation.getCurrentPosition(
      (location) => {
        console.log("location",location);
        console.log(getDistanceFromLatLonInKm(location.coords.latitude, location.coords.longitude, location.coords.latitude, location.coords.longitude));
        setLocation(location);
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watch);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  const createRoom = async (name) => {
    setIsOpen(false);
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    const { chatRoom } = await api.post('/chat_rooms', { name, longitude, latitude });
    setChatRooms([...chatRooms, chatRoom]);
  };

  return (
    <>
      <div className="container">
        <Rooms>
          {chatRooms.map((room) => {
            return (
              <Room key={room.id} to={`chat_rooms/${room.id}`}>
                {room.name}
              </Room>
            );
          })}
          <Room action={() => setIsOpen(true)}>+</Room>
        </Rooms>
        <div className="chat-window w-full">
          <section>
            <Map chatRooms={chatRooms}/>
          </section>
          <Routes>
            <Route path="chat_rooms/:id" element={<ChatRoom />} />
            <Route path="/*" element={<div>Select a room to get started</div>} />
          </Routes>
        </div>
        {isOpen ? <NewRoomModal createRoom={createRoom} /> : null}
      </div>
    </>
  );
};
