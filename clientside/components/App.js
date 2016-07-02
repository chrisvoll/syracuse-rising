import React from 'react';
import MapContainer from '../containers/MapContainer';
import OmniboxContainer from '../containers/OmniboxContainer';
import '../styles/App.scss';

var App = React.createClass({
  propTypes: {
    loadServerData: React.PropTypes.func
  },

  componentDidMount() {
    this.props.loadServerData();
  },

  render() {
    return <div className="app">
      <div className="app__header">
        <div className="app__header__logo">
          <strong>Syracuse</strong> Rising
        </div>
      </div>
      <div className="map-container">
        <OmniboxContainer />
        <MapContainer />
      </div>
    </div>;
  }
});

export default App;
