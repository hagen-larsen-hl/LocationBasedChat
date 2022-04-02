import { useEffect, useState, useRef } from 'react';
import { Rooms } from './rooms';
import { Room } from './room';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken =
  'pk.eyJ1IjoiaGFnZW4tbGFyc2VuLWhsIiwiYSI6ImNsMWQ0Njl1ajA4Ym0zam54NGNqeW80OGIifQ.hz_0yz3jGgLX6qVSUU9Crw';

export const Map = (chatRooms) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [updates, setUpdates] = useState([]);
  const [rooms, setRooms] = useState([]);
  const updatesRef = useRef([]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      zoom: 9, // starting zoom
    });
    let marker;
    const watch = navigator.geolocation.getCurrentPosition(
      (location) => {
        if (!marker) {
          marker = new mapboxgl.Marker();
          marker.setLngLat([location.coords.longitude, location.coords.latitude]);
          marker.addTo(map);
        } else {
          marker.setLngLat([location.coords.longitude, location.coords.latitude]);
        }
        map.flyTo({
          center: [location.coords.longitude, location.coords.latitude],
        });
        updatesRef.current.push(location);
        setUpdates([...updatesRef.current]);

        console.log('Chatrooms', chatRooms);
        for (let chatRoom of chatRooms.chatRooms) {
          let roomMarker = new mapboxgl.Marker({ color: '#b22222' });
          roomMarker.setLngLat([chatRoom.longitude, chatRoom.latitude]);
          roomMarker.addTo(map);
        }
        setRooms(chatRooms.chatRooms.filter(room => getDistanceFromLatLonInKm(room.latitude, room.longitude, location.coords.latitude, location.coords.longitude) < 5));
      },
      (err) => {
        setErrorMessage(err.message);
      },
    );

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1); // deg2rad below
      var dLon = deg2rad(lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return d;
    }
  
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }

    return () => {
      navigator.geolocation.clearWatch(watch);
    };
  }, []);

  return (
    <div className="p-4">
      <link href="https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.css" rel="stylesheet" />
        <Rooms>
          {rooms.map((room) => {
            return (
              <Room key={room.id} to={`chat_rooms/${room.id}`}>
                {room.name}
              </Room>
            );
          })}
        </Rooms>
      Ï<div className="w-4/5" id="map"></div>
      {errorMessage} {errorMessage && 'You need to enable location services for this app to work'}
      
    </div>
  );
};
