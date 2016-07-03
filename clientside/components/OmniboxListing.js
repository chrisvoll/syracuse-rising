import React from 'react';
import listingEnum from '../helpers/listingEnum';
import util from '../util';

var OmniboxListing = React.createClass({
  propTypes: {
    listing: React.PropTypes.object,

    onHoverListing: React.PropTypes.func,
    onSelectListing: React.PropTypes.func
  },

  shouldComponentUpdate(prevProps) {
    return false;
  },

  handleHover() {
    this.props.onHoverListing(this.props.listing.get('id'));
  },

  handleClick() {
    this.props.onSelectListing(this.props.listing.get('id'));
  },

  render() {
    var listing = this.props.listing;

    return <div
        className="omnibox__listing"
        onMouseEnter={this.handleHover}
        onClick={this.handleClick}>

      <div className="omnibox__listing__details">
        <div className="omnibox__listing__name">
          {listing.get('name')}
        </div>

        <div className="omnibox__listing__type" style={{ color: listingEnum.types[listing.get('type')]['marker-color'] }}>
          {listingEnum.types[listing.get('type')].label}
        </div>

        <div className="omnibox__listing__neighborhood">
          {listing.get('neighborhood')}
        </div>

        {!!listing.get('cost') &&
          <div className="omnibox__listing__cost">
            {util.shortenCost(listing.get('cost'))}
          </div>
        }
      </div>

      {listing.get('photo') &&
        <div className="omnibox__listing__photo" style={{ backgroundImage: 'url(https://dl.dropboxusercontent.com/u/21879/syracuse/' + listing.get('photo') + ')'}} />
      }
    </div>;
  }
});

export default OmniboxListing;
