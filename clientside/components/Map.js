import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import mapboxgl from 'mapbox-gl';

import listingEnum from '../helpers/listingEnum';
import '../styles/Map.scss';

var Map = React.createClass({
  propTypes: {
    listings: React.PropTypes.object,
    hoveredListing: React.PropTypes.string,
    selectedListing: React.PropTypes.string,

    onHoverListing: React.PropTypes.func,
    onSelectListing: React.PropTypes.func
  },

  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY3ZvbGwiLCJhIjoiNWYxYzJiMTU4NWM2MDRmNjgzMjcwZWI0Y2YxZmEyZWYifQ._j4hcQH-5ngUVb_lDFEoZg';

    this.map = new mapboxgl.Map({
      container: ReactDOM.findDOMNode(this),
      style: 'mapbox://styles/mapbox/streets-v8',
      center: [-76.1486941, 43.0476822],
      zoom: 12.4
    });

    this.map.on('load', this.plotListingsAfterEverythingIsLoaded);
    this.map.on('click', this.handleClick);
    this.map.on('mousemove', this.handleMouseMove);

    this.popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });
  },

  componentDidUpdate(prevProps) {
    if (this.props.listings.size && prevProps.listings !== this.props.listings) {
      this.plotListingsAfterEverythingIsLoaded();
    }

    if (this.props.hoveredListing !== prevProps.hoveredListing) {
      this.setHovered(this.props.hoveredListing);
    }

    if (this.props.selectedListing !== prevProps.selectedListing) {
      this.setSelected(this.props.selectedListing);
    }
  },

  setHovered(id) {
    var { listing, geoJSON } = this.setMarker('hovered', id);
    if (listing && geoJSON) {
      this.popup
        .setLngLat(geoJSON.geometry.coordinates)
        .setHTML(listing.get('name'))
        .addTo(this.map);
    } else {
      this.popup.remove();
    }
  },

  setSelected(id) {
    this.setMarker('selected', id);
  },

  setMarker(type, id) {
    if (!this.initialized) return {};
    var listing = this.props.listings.filter(l => l.get('id') === id).first();
    var geoJSON = this.generateGeoJSON(listing);

    this.map.getSource('markers-' + type).setData({
      type: 'FeatureCollection',
      features: geoJSON ? [geoJSON] : []
    });

    return { listing, geoJSON };
  },

  costBucket(cost) {
    var mil = 1000000;
    if (cost < 1 * mil) {
      return 'radius-4';
    } else if (cost < 5 * mil) {
      return 'radius-5';
    } else if (cost < 10 * mil || !cost) {
      return 'radius-6';
    } else if (cost < 30 * mil) {
      return 'radius-7';
    } else if (cost < 50 * mil) {
      return 'radius-8';
    } else if (cost < 90 * mil) {
      return 'radius-9';
    } else if (cost < 150 * mil) {
      return 'radius-10';
    }

    return 'radius-11';
  },

  generateGeoJSON(listing) {
    if (!listing) return;

    return {
      type: 'Feature',
      properties: {
        id: listing.get('id'),
        type: listing.get('type'),
        cost: this.costBucket(listing.get('cost'))
      },
      geometry: {
        type: 'Point',
        coordinates: [listing.get('lon'), listing.get('lat')]
      }
    };
  },

  plotListingsAfterEverythingIsLoaded() {
    this.loadCount = (this.loadCount || 0) + 1;
    if (this.loadCount < 2) return;

    this.plotListings(this.props.listings);
  },

  plotListings(listings) {
    this.initializeSources();
    this.map.getSource('markers').setData({
      type: 'FeatureCollection',
      features: listings.map(this.generateGeoJSON).toJS()
    });
  },

  initializeSources() {
    if (this.initialized) return;
    this.initialized = true;

    var emptySource = () => {
      return { type: 'geojson', data: { type: 'FeatureCollection', features: [] } };
    };

    this.map.addSource('markers', emptySource());
    this.map.addSource('markers-hovered', emptySource());
    this.map.addSource('markers-selected', emptySource());

    var color = {
      property: 'type',
      type: 'categorical',
      stops: [
        ['commercial', '#9c89cc'],
        ['residential', '#f86767'],
        ['mixed', '#1087BF'],
        ['infrastructure', '#ffde00'],
        ['academic', '#89c200'],
        ['healthcare', '#7ec9b1']
      ]
    };

    this.map.addLayer({
      id: 'markers',
      interactive: true,
      type: 'circle',
      source: 'markers',
      paint: {
        'circle-color': color,
        'circle-opacity': 0.8,
        'circle-radius': {
          property: 'cost',
          type: 'categorical',
          stops: [
            ['radius-4', 4],
            ['radius-5', 5],
            ['radius-6', 6],
            ['radius-7', 7],
            ['radius-8', 8],
            ['radius-9', 9],
            ['radius-10', 10],
            ['radius-11', 11]
          ]
        }
      }
    });

    this.map.addLayer({
      id: 'markers-hovered',
      type: 'circle',
      source: 'markers-hovered',
      paint: {
        'circle-radius': 12,
        'circle-color': color
      }
    });

    this.map.addLayer({
      id: 'markers-selected',
      type: 'circle',
      source: 'markers-selected',
      paint: {
        'circle-radius': 14,
        'circle-color': color
      }
    });
  },

  featuresAtEvent(e, callback) {
    callback(this.map.queryRenderedFeatures(e.point, { layers: ['markers'] }));
  },

  handleClick(e) {
    this.featuresAtEvent(e, features => {
      if (!features.length) {
        this.props.onSelectListing(null);
        return;
      }

      this.props.onSelectListing(features[0].properties.id);
    });
  },

  handleMouseMove(e) {
    this.featuresAtEvent(e, features => {
      if (!features.length) {
        this.props.onHoverListing(null);
        return;
      }

      this.props.onHoverListing(features[0].properties.id);
    });
  },

  render() {
    return <div className={'map' + (this.props.hoveredListing ? ' map--hovered' : '')} />;
  }
});

export default Map;
