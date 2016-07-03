import React from 'react';
import OmniboxListing from './OmniboxListing';
import util from '../util';

var OmniboxListings = React.createClass({
  propTypes: {
    listings: React.PropTypes.object,
    filterValue: React.PropTypes.string,

    onHoverListing: React.PropTypes.func,
    onSelectListing: React.PropTypes.func
  },

  render() {
    // Try to grab a photo from the listings
    var photo = this.props.listings.filter(l => l.get('photo')).getIn([0, 'photo']);
    var style = {};
    if (photo) {
      style.backgroundImage = util.imageUrl(photo);
    }

    return <div className="omnibox__listings">
      <div className={'omnibox__photo omnibox__photo--' + (photo ? 'photo' : 'no-photo')} style={style}>
        <div className="omnibox__header">
          <div className="omnibox__title">
            {this.props.filterValue || 'All Projects'}
          </div>
        </div>
      </div>
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
