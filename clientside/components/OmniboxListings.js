import React from 'react';
import OmniboxListing from './OmniboxListing';

var OmniboxListings = React.createClass({
  propTypes: {
    listings: React.PropTypes.object,

    onHoverListing: React.PropTypes.func,
    onSelectListing: React.PropTypes.func
  },

  render() {
    return <div className="omnibox__listings">
      {this.props.listings.map(listing => {
        return <OmniboxListing
                  listing={listing}
                  onHoverListing={this.props.onHoverListing}
                  onSelectListing={this.props.onSelectListing}
                  key={listing.get('id')} />
      })}
    </div>;
  }
});

export default OmniboxListings;
