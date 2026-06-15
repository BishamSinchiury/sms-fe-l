import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaLocationArrow } from "react-icons/fa";
import styles from "./LocationPicker.module.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_CENTER = [26.5526, 88.0833];

const ClickHandler = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const RecenterOnChange = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, Math.max(map.getZoom(), 12));
    }
  }, [position?.[0], position?.[1]]);
  return null;
};

const LocationPicker = ({ latitude, longitude, onChange }) => {
  const hasCoords =
    latitude !== null && latitude !== undefined && latitude !== "" &&
    longitude !== null && longitude !== undefined && longitude !== "";

  const position = hasCoords ? [Number(latitude), Number(longitude)] : null;
  const center = position || DEFAULT_CENTER;

  // Clamps both values to 6 decimal places before bubbling up.
  // parseFloat strips the trailing zeros that toFixed adds as a string.
  const emit = (lat, lng) => onChange(
    parseFloat(lat.toFixed(6)),
    parseFloat(lng.toFixed(6))
  );

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Your browser doesn't support location detection.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => emit(pos.coords.latitude, pos.coords.longitude),
      () => alert("Couldn't get your current location. Check your browser's location permissions.")
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.mapBox}>
        <MapContainer
          center={center}
          zoom={position ? 13 : 7}
          className={styles.map}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onSelect={emit} />
          {position && (
            <Marker
              position={position}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  emit(lat, lng);
                },
              }}
            />
          )}
          <RecenterOnChange position={position} />
        </MapContainer>
        <button type="button" className={styles.locateBtn} onClick={handleLocate}>
          <FaLocationArrow /> Use current location
        </button>
      </div>
      <p className={styles.hint}>
        {position
          ? `Selected: ${position[0].toFixed(6)}, ${position[1].toFixed(6)}`
          : "Click on the map, drag the marker, or use your current location to set the address."}
      </p>
    </div>
  );
};

export default LocationPicker;