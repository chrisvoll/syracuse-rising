import React from 'react';
import Animation from 'react-addons-css-transition-group';
import '../styles/Omnibox.scss';
import listingEnum from '../helpers/listingEnum';

class Omnibox extends React.Component {
  renderOmnibox() {
    const listing = this.props.selectedListing;
    if (!listing) {
      return null;
    }

    var style = {};
    if (listing.photo) {
      style.backgroundImage = 'url(https://dl.dropboxusercontent.com/u/21879/syracuse/' + listing.photo + ')';
    }

    return <div className="omnibox">
      <div className="omnibox__photo" style={ style }>
        <div className="omnibox__header">
          <div className="omnibox__title">
            {listing.name}
          </div>

          <div className="omnibox__type" style={{ background: listingEnum.types[listing.type]['marker-color'] }}>
            {listingEnum.types[listing.type].label}
          </div>

          {listing.cost &&
            <div className="omnibox__cost">
              ${listing.cost}
            </div>
          }
        </div>
      </div>

      {listing.description &&
        <div className="omnibox__description">
          {listing.description}
        </div>
      }

      <div className="omnibox__details">
        <div className="omnibox__details__row">
          <div className="omnibox__details__row__key">
            Status
          </div>
          <div className="omnibox__details__row__value">
            {listingEnum.status[listing.status]}
          </div>
        </div>
      </div>
    </div>;
  }

  render() {
    return <Animation transitionName="omnibox-animation" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
      {this.renderOmnibox()}
    </Animation>;
  }
}

export default Omnibox;
