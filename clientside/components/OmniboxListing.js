import React from 'react';
import listingEnum from '../helpers/listingEnum';

var OmniboxListing = React.createClass({
  propTypes: {
    listing: React.PropTypes.object,

    onHoverListing: React.PropTypes.func,
    onSelectListing: React.PropTypes.func
  },

  shouldComponentUpdate(prevProps) {
    return false;
    return prevProps.hoveredListing === this.props.listing.get('id') || this.props.hoveredListing === this.props.listing.get('id');
  },

  formatCost(cost) {
    if (!cost) return null;

    var dollars = parseInt(cost.replace(/,/g, ''), 10);

    if (dollars >= 1000000) {
      dollars = (dollars / 1000000) + 'm';
    } else if (dollars >= 1000) {
      dollars = (dollars / 1000) + 'k';
    }

    return (dollars ? '$' : '') + dollars;
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

        <div className="omnibox__listing__cost">
          {this.formatCost(listing.get('cost'))}
        </div>
      </div>

      {listing.get('photo') &&
        <div className="omnibox__listing__photo" style={{ backgroundImage: 'url(https://dl.dropboxusercontent.com/u/21879/syracuse/' + listing.get('photo') + ')'}} />
      }
    </div>;
  }
});

export default OmniboxListing;
