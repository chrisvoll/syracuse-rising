import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import listingEnum from '../helpers/listingEnum';
import mapboxgl from 'mapbox-gl';
import '../styles/Map.scss';

mapboxgl.accessToken = 'pk.eyJ1IjoiY3ZvbGwiLCJhIjoiNWYxYzJiMTU4NWM2MDRmNjgzMjcwZWI0Y2YxZmEyZWYifQ._j4hcQH-5ngUVb_lDFEoZg';

var Map = React.createClass({
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: ReactDOM.findDOMNode(this),
      style: 'mapbox://styles/mapbox/streets-v8',
      center: [-76.1486941, 43.0476822],
      zoom: 12.4,
      pitch: 30
    });

    this.map.on('load', this.plotListingsAfterEverythingIsLoaded);

    this.popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    this.loadCount = 0;
  },

  componentDidUpdate(prevProps) {
    if (this.props.listings.size && prevProps.listings !== this.props.listings) {
      this.plotListingsAfterEverythingIsLoaded();
    }

    if (this.props.hoveredListing !== prevProps.hoveredListing) {
      this.setHovered(this.props.hoveredListing);
    }
  },

  plotListingsAfterEverythingIsLoaded() {
    this.loadCount++;
    if (this.loadCount < 2) return;

    this.plotListings(this.props.listings);
  },

  setHovered(id) {
    var listing = this.props.listings.filter(l => l.get('id') === id).first();
    var geoJSON = this.generateGeoJSON(listing);

    if (listing && geoJSON) {
      this.popup
        .setLngLat(geoJSON.geometry.coordinates)
        .setHTML(listing.get('name'))
        .addTo(this.map);
    } else {
      this.popup.remove();
    }

    this.map.getSource('markers-hovered').setData({
      type: 'FeatureCollection',
      features: geoJSON ? [geoJSON] : []
    });
  },

  costBucket(cost) {
    var dollars = parseInt(cost.replace(/,/g, ''), 10);
    var mil = 1000000;
    if (dollars < 1 * mil) {
      return 'radius-4';
    } else if (dollars < 5 * mil) {
      return 'radius-5';
    } else if (dollars < 10 * mil) {
      return 'radius-6';
    } else if (dollars < 30 * mil) {
      return 'radius-7';
    } else if (dollars < 50 * mil) {
      return 'radius-8';
    } else if (dollars < 90 * mil) {
      return 'radius-9';
    } else if (dollars < 150 * mil) {
      return 'radius-10';
    }

    return 'radius-11';
  },

  generateGeoJSON(listing) {
    if (!listing) {
      return;
    }

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

  plotListings(listings) {
    const markers = {
      type: 'FeatureCollection',
      features: listings.map(this.generateGeoJSON).toJS()
    };

    this.map.addSource('markers', {
      type: 'geojson',
      data: markers
    });

    this.map.addSource('markers-hovered', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });

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
      interactive: false,
      type: 'circle',
      source: 'markers-hovered',
      paint: {
        'circle-radius': 12,
        'circle-color': color
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
    var className = 'map';
    if (this.props.hoveredListing) {
      className = 'map map--hovered';
    }

    return <div className={className} />;
  }
});

export default Map;
