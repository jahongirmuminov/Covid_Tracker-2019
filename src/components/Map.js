import React from 'react'
import './Map.css'
import {MapContainer,TileLayer} from 'react-leaflet'
import {showDataonMap} from './util'
const Map = ({countries,casesType,center,zoom}) => {
    return (
        <div className="map">
            <MapContainer zoom={zoom} center={center}>
            <TileLayer
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>

               {showDataonMap(countries,casesType)}
            </MapContainer>
        </div>
    )
}

export default Map
