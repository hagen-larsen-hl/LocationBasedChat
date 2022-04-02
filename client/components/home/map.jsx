import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken =
  'pk.eyJ1IjoiaGFnZW4tbGFyc2VuLWhsIiwiYSI6ImNsMWQ0Njl1ajA4Ym0zam54NGNqeW80OGIifQ.hz_0yz3jGgLX6qVSUU9Crw';

export const Map = (chatRooms) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [updates, setUpdates] = useState([]);
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
        }
        else {
          marker.setLngLat([location.coords.longitude, location.coords.latitude]);
        }
          map.flyTo({
              center: [location.coords.longitude, location.coords.latitude],
          });
        updatesRef.current.push(location);
        setUpdates([...updatesRef.current]);

        console.log("Chatrooms", chatRooms);
        for (let chatRoom of chatRooms.chatRooms) {
          let roomMarker = new mapboxgl.Marker({"color": "#b22222"});
          roomMarker.setLngLat([chatRoom.longitude, chatRoom.latitude]);
          roomMarker.addTo(map);

        }
      },
      (err) => {
        setErrorMessage(err.message);
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watch);
    };
  }, []);

  return (
    <div className="p-4">
      <link href='https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.css' rel='stylesheet' />
      <div id="map"></div>
      {errorMessage} {errorMessage && 'You need to enable location services for this app to work'}
      <div>
        {updates.map((update, i) => {
          return (
            <div key={i}>
              {update.coords.longitude} {update.coords.latitude}
            </div>
          );
        })}
      </div>
    </div>
  );
};
