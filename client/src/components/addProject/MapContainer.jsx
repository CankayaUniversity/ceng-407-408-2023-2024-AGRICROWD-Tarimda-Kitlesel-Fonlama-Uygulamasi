import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

class MapContainer extends Component {
  state = {
    markers: [] // Tıklanan yerlerin koordinatlarını saklayacağımız dizi
  };

  onMapClick = (mapProps, map, clickEvent) => {
    const { latLng } = clickEvent; // Tıklanan yerin koordinatları
    const newMarker = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };

    this.setState(prevState => ({
      markers: [...prevState.markers, newMarker] // Yeni işaretin eklenmesi
    }));
  };

  render() {
    const mapStyles = {
      
      width: '60%',
      height: '50%',
    
    };

    return (
      <Map
        google={this.props.google}
        zoom={6} // Türkiye'nin tamamını göstermek için uygun bir yakınlaştırma seviyesi
        style={mapStyles}
        initialCenter={{ lat: 39.92077, lng: 32.85411 }} // Türkiye'nin merkez koordinatları
        onClick={this.onMapClick} // Haritaya tıklama olayını dinlemek için
      >
        {/* Tıklanan her yer için bir Marker oluşturulması */}
        {this.state.markers.map((marker, index) => (
          <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} />
        ))}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCeX1Ik2xsXyCZISMyquhfmYyzRl2rlT_g' // API anahtarınızı buraya ekleyin
})(MapContainer);
