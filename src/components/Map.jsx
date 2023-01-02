import { useState } from "react";
import { TileLayer, MapContainer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
// const markerIcon = new L.Icon({
//   iconUrl: "../../public/img/pin.png",
//   iconSize: [35, 45],
// });
const Map = ({ tour }) => {
  const center = [...tour.startLocation.coordinates].reverse();
  return (
    <MapContainer
      zoom={7}
      scrollWheelZoom={false}
      style={{ height: "100%" }}
      center={center}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {tour.locations.map((location, i) => {
        return (
          <Marker
            position={[...location.coordinates].reverse()}
            key={i}
            // icon={markerIcon}
          >
            <Popup>
              <div style={{ fontSize: "1.4em" }}>
                <h1>
                  Day {location.day}: {location.description}
                </h1>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
