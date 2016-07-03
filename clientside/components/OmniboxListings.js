import React from 'react';
import OmniboxListing from './OmniboxListing';
import util from '../util';

var OmniboxListings = React.createClass({
  propTypes: {
    listings: React.PropTypes.object,
    filterValue: React.PropTypes.string,
    searchQuery: React.PropTypes.string,

    onHoverListing: React.PropTypes.func,
    onSelectListing: React.PropTypes.func
  },

  getTitle() {
    if (this.props.filterValue) {
      return this.props.filterValue;
    } else if (this.props.searchQuery) {
      return 'Search Results';
    }
    return 'All Projects';
  },

  render() {
    // Try to grab a photo from the listings
    var photo, style = {};
    if (!this.props.searchQuery) {
      var photo = this.props.listings.filter(l => l.get('photo')).getIn([0, 'photo']);
      if (photo) style.backgroundImage = util.imageUrl(photo);
    }

    return <div className="omnibox__listings">
      <div className={'omnibox__photo omnibox__photo--' + (photo ? 'photo' : 'no-photo')} style={style}>
        <div className="omnibox__header">
          <div className="omnibox__title">
            {this.getTitle()}
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
