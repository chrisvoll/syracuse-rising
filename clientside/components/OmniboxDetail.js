import React from 'react';
import listingEnum from '../helpers/listingEnum';

var OmniboxDetail = React.createClass({
  propTypes: {
    listing: React.PropTypes.object
  },

  render() {
    var listing = this.props.listing;
    if (!listing) return null;

    var style = {};
    if (listing.get('photo')) {
      style.backgroundImage = 'url(https://dl.dropboxusercontent.com/u/21879/syracuse/' + listing.get('photo') + ')';
    }

    return <div className="omnibox__detail">
      <div className="omnibox__photo" style={style}>
        <div className="omnibox__header">
          <div className="omnibox__title">
            {listing.get('name')}
          </div>

          <div className="omnibox__type" style={{ background: listingEnum.types[listing.get('type')]['marker-color'] }}>
            {listingEnum.types[listing.get('type')].label}
          </div>

          {listing.get('cost') &&
            <div className="omnibox__cost">
              ${listing.get('cost')}
            </div>
          }
        </div>
      </div>

      {listing.get('description') &&
        <div className="omnibox__description">
          {listing.get('description')}
        </div>
      }

      <div className="omnibox__details">
        <div className="omnibox__details__row">
          <div className="omnibox__details__row__key">
            Status
          </div>
          <div className="omnibox__details__row__value">
            {listingEnum.status[listing.get('status')]}
          </div>
        </div>
      </div>
    </div>
  }
});

export default OmniboxDetail;
