import React from 'react';
import MapContainer from '../containers/MapContainer';
import OmniboxContainer from '../containers/OmniboxContainer';
import TableContainer from '../containers/TableContainer';
import '../styles/App.scss';

var App = React.createClass({
  propTypes: {
    loadServerData: React.PropTypes.func
  },

  componentDidMount() {
    this.props.loadServerData();
  },

  render() {
    return <div>
      <MapContainer />
      <OmniboxContainer />
      <TableContainer />
    </div>;
  }
});

export default App;
