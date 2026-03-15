import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fiksini Leaflet marker ikoonid
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function LeafletMap({ location }) {
  if (!location || !location.lat || !location.lon) {
    return <div className="map-placeholder">Kaardi andmeid pole saadaval</div>
  }

  return (
    <div className="map-container">
      <MapContainer
        center={[location.lat, location.lon]}
        zoom={10}
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lon]}>
          <Popup>
            <strong>{location.name}</strong>
            <br />
            {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default LeafletMap
