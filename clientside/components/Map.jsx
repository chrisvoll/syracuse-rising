import React from 'react';
import ReactDOM from 'react-dom';
import listingEnum from '../helpers/listingEnum';
var mapboxgl = window.mapboxgl;

mapboxgl.accessToken = 'pk.eyJ1IjoiY3ZvbGwiLCJhIjoiNWYxYzJiMTU4NWM2MDRmNjgzMjcwZWI0Y2YxZmEyZWYifQ._j4hcQH-5ngUVb_lDFEoZg';

class Map extends React.Component {
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: ReactDOM.findDOMNode(this),
      style: 'mapbox://styles/mapbox/streets-v8',
      center: [-76.1486941, 43.0476822],
      zoom: 11.15,
      pitch: 30
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.listings.length && prevProps.listings !== this.props.listings) {
      this.plotListings(this.props.listings);
    }
  }

  plotListings(listings) {
    const markers = {
      type: 'FeatureCollection',
      features: listings.map(listing => {
        return {
          type: 'Feature',
          properties: {
            listing,
            'marker-symbol': listingEnum.types[listing.type]['marker-symbol'],
            'marker-color': listingEnum.types[listing.type]['marker-color']
          },
          geometry: {
            type: 'Point',
            coordinates: [listing.lon, listing.lat]
          }
        }
      })
    };

    this.map.addSource('markers', {
      type: 'geojson',
      data: markers
    });

    this.map.addLayer({
      id: 'markers',
      interactive: true,
      type: 'symbol',
      source: 'markers',
      layout: {
        'icon-image': "{marker-symbol}-15"
      }
    });

    this.map.on('click', this.handleClick.bind(this));
  }

  handleClick(e) {
    this.map.featuresAt(e.point, {
      layer: 'markers',
      radius: 10,
      includeGeometry: true
    }, (err, features) => {
      if (err || !features.length) {
        this.props.onSelectListing(null);
        return;
      }

      var feature = features[0];
      this.props.onSelectListing(feature.properties.listing.id);
    });
  }

  render() {
    return <div style={{ width: '100%', height: '90vh' }} />;
  }
}

export default Map;
