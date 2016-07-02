import React from 'react';
import ReactDOM from 'react-dom';
import listingEnum from '../helpers/listingEnum';
var mapboxgl = window.mapboxgl;

mapboxgl.accessToken = 'pk.eyJ1IjoiY3ZvbGwiLCJhIjoiNWYxYzJiMTU4NWM2MDRmNjgzMjcwZWI0Y2YxZmEyZWYifQ._j4hcQH-5ngUVb_lDFEoZg';

var Map = React.createClass({
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: ReactDOM.findDOMNode(this),
      style: 'mapbox://styles/mapbox/streets-v8',
      center: [-76.1486941, 43.0476822],
      zoom: 11.15,
      pitch: 30
    });
  },

  componentDidUpdate(prevProps) {
    if (this.props.listings.length && prevProps.listings !== this.props.listings) {
      this.plotListings(this.props.listings);
    }
  },

  plotListings(listings) {
    const markers = {
      type: 'FeatureCollection',
      features: listings.map(listing => {
        return {
          type: 'Feature',
          properties: {
            listing,
            'marker-symbol': listingEnum.types[listing.type]['marker-symbol'],
            'icon-color': listingEnum.types[listing.type]['marker-color']
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
    this.map.on('mousemove', this.handleMouseMove.bind(this));
  },

  featuresAtEvent(e, callback) {
    this.map.featuresAt(e.point, {
      layer: 'markers',
      radius: 10,
      includeGeometry: true
    }, callback.bind(this));
  },

  handleClick(e) {
    this.featuresAtEvent(e, (err, features) => {
      if (err || !features.length) {
        this.props.onSelectListing(null);
        return;
      }

      this.props.onSelectListing(features[0].properties.listing.id);
    });
  },

  handleMouseMove(e) {
    this.featuresAtEvent(e, (err, features) => {
      if (err || !features.length) {
        this.props.onHoverListing(null);
        return;
      }

      this.props.onHoverListing(features[0].properties.listing.id);
    });
  },

  render() {
    var style = {
      width: '100%',
      height: '90vh'
    };

    var className = '';
    if (this.props.hoveredListing) {
      className = 'hovered';
    }

    return <div className={className} style={style} />;
  }
});

export default Map;
