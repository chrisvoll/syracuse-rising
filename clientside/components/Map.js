import React from 'react';
import ReactDOM from 'react-dom';
import listingEnum from '../helpers/listingEnum';
import mapboxgl from 'mapbox-gl';

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
    if (this.props.listings.size && prevProps.listings !== this.props.listings) {
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
            listingId: listing.get('id'),
            'marker-symbol': listingEnum.types[listing.get('type')]['marker-symbol'],
            'icon-color': listingEnum.types[listing.get('type')]['marker-color']
          },
          geometry: {
            type: 'Point',
            coordinates: [listing.get('lon'), listing.get('lat')]
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

    this.map.on('click', this.handleClick);
    this.map.on('mousemove', this.handleMouseMove);
  },

  featuresAtEvent(e, callback) {
    var features = this.map.queryRenderedFeatures(e.point, {
      layers: ['markers']
    });

    callback(features);
  },

  handleClick(e) {
    this.featuresAtEvent(e, features => {
      if (!features.length) {
        this.props.onSelectListing(null);
        return;
      }

      this.props.onSelectListing(features[0].properties.listingId);
    });
  },

  handleMouseMove(e) {
    this.featuresAtEvent(e, features => {
      if (!features.length) {
        this.props.onHoverListing(null);
        return;
      }

      this.props.onHoverListing(features[0].properties.listingId);
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
