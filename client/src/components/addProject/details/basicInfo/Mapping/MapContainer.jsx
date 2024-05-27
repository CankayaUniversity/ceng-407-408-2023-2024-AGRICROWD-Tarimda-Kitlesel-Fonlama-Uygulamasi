import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

class MapContainer extends Component {
  state = {
    marker: null,
  };

  componentDidMount() {
    const savedMarker = JSON.parse(localStorage.getItem('mapMarker'));
    if (savedMarker) {
      this.setState({ marker: savedMarker });
    }
  }

  onMapClick = (mapProps, map, clickEvent) => {
    const { latLng } = clickEvent;
    const newMarker = {
      lat: latLng.lat(),
      lng: latLng.lng(),
    };

    this.setState({ marker: newMarker });

    // Harita tıklama olayında parent callback fonksiyonunu çağır
    if (this.props.onLocationSelect) {
      this.props.onLocationSelect(newMarker);
    }
  };

  render() {
    const mapStyles = {
      width: '49%',
      height: '50%',
      zIndex: '0',
    };

    return (
      <Map
        google={this.props.google}
        zoom={6}
        style={mapStyles}
        initialCenter={{ lat: 39.92077, lng: 32.85411 }}
        onClick={this.onMapClick}
      >
        {this.state.marker && (
          <Marker
            position={{
              lat: this.state.marker.lat,
              lng: this.state.marker.lng,
            }}
          />
        )}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCeX1Ik2xsXyCZISMyquhfmYyzRl2rlT_g',
})(MapContainer);
