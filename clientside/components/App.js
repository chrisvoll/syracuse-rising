import React from 'react';
import MapContainer from '../containers/MapContainer';
import OmniboxContainer from '../containers/OmniboxContainer';
import '../styles/App.scss';

var App = React.createClass({
  propTypes: {
    loadServerData: React.PropTypes.func,
    searchQuery: React.PropTypes.string,
    onSetSearch: React.PropTypes.func
  },

  componentDidMount() {
    this.props.loadServerData();
  },

  handleSearch(e) {
    this.props.onSetSearch(e.target.value);
  },

  render() {
    return <div className="app">
      <div className="app__header">
        <div className="app__header__logo">
          <strong>Syracuse</strong> Rising
        </div>
        <input value={this.props.searchQuery} onChange={this.handleSearch} style={{ color: '#000' }} />
      </div>
      <div className="map-container">
        <OmniboxContainer />
        <MapContainer />
      </div>
    </div>;
  }
});

export default App;
