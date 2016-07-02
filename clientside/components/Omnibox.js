import React from 'react';
// import Animation from 'react-addons-css-transition-group';
import OmniboxDetail from './OmniboxDetail';
import OmniboxListings from './OmniboxListings';

import '../styles/Omnibox.scss';

var Omnibox = React.createClass({
  propTypes: {
    listings: React.PropTypes.object,
    selectedListing: React.PropTypes.object,

    onHoverListing: React.PropTypes.func,
    onSelectListing: React.PropTypes.func
  },

  render() {
    return <div className="omnibox">
      <OmniboxDetail
        listing={this.props.selectedListing} />
      <OmniboxListings
        listings={this.props.listings}
        onHoverListing={this.props.onHoverListing}
        onSelectListing={this.props.onSelectListing} />
    </div>;
  }
});

export default Omnibox;
