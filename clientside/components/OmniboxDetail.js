import React from 'react';
import listingEnum from '../helpers/listingEnum';
import util from '../util';

var OmniboxDetail = React.createClass({
  propTypes: {
    listing: React.PropTypes.object
  },

  detail(label, key, value) {
    if (!key && !value) return null;
    if (key && !this.props.listing.get(key)) return null;

    return <div className="omnibox__details__row">
      <div className="omnibox__details__row__key">
        {label}
      </div>
      <div className="omnibox__details__row__value">
        {value || this.props.listing.get(key)}
      </div>
    </div>;
  },

  tag(key, template = '{value}') {
    if (!this.props.listing.get(key)) return null;

    return <div className="omnibox__details__tag">
      {template.replace('{value}', this.props.listing.get(key))}
    </div>;
  },

  render() {
    var listing = this.props.listing;

    var style = {};
    if (listing.get('photo')) {
      style.backgroundImage = util.imageUrl(listing.get('photo'));
    }

    return <div className="omnibox__detail">
      <div
        className={'omnibox__photo omnibox__photo--' + (listing.get('photo') ? 'photo' : 'no-photo')}
        style={style}>

        <div className="omnibox__header">
          <div className="omnibox__title">
            {listing.get('name')}
          </div>

          <div
            className="omnibox__type"
            style={{ background: listingEnum.types[listing.get('type')]['marker-color'] }}>
            {listing.get('prettyType')}
          </div>

          <div className="omnibox__cost">
            {util.formatCost(listing.get('cost'))}
          </div>
        </div>
      </div>

      {listing.get('description') &&
        <div className="omnibox__description">
          {listing.get('description')}
        </div>
      }

      <div className="omnibox__details">
        {this.detail('Status', null, listingEnum.status[listing.get('status')] + (listing.get('year') ? ', ' + listing.get('year') : ''))}
        {this.detail('Developer', 'developer')}
        {this.detail('Tenants', 'tenants')}
        {this.detail('Address', 'location')}
        {this.detail('Neighborhood', 'neighborhood')}

        {this.tag('sqft', '{value} sqft')}
        {this.tag('jobs', '{value} jobs')}
        {this.tag('stories', '{value} stories')}
        {this.tag('units', '{value} units')}
        {this.tag('originalyear', 'built in {value}')}
        {this.tag('updated', 'updated {value}')}

        {listing.get('details') &&
          <a className="omnibox__details__source" href={listing.get('details')} target="_blank">
            More Information
          </a>
        }
      </div>
    </div>
  }
});

export default OmniboxDetail;
