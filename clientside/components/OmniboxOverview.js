import React from 'react';
import Immutable from 'immutable';
import util from '../util';

var OmniboxOverview = React.createClass({
  propTypes: {
    onSetFilter: React.PropTypes.func,
    stats: React.PropTypes.object
  },

  label(label) {
    return <div className="omnibox__overview__label">
      {label}
    </div>;
  },

  item(label, key, value, data) {
    return <div className="omnibox__overview__item" onClick={() => this.props.onSetFilter(key, value)} key={key + value}>
      <div className="omnibox__overview__item__label">
        {label}
      </div>
      <div className="omnibox__overview__item__data">
        {util.shortenCost(data)}
      </div>
    </div>
  },

  render() {
    return <div className="omnibox__overview">

      {this.label('Get Started')}
      {this.item('All Projects', 'all', null, this.props.stats.get('total'))}

      {this.label('Neighborhoods')}
      {this.props.stats.get('neighborhoods', Immutable.Map()).sort((a, b) => b - a).map((v, k) => {
        return this.item(k, 'neighborhood', k, v);
      }).valueSeq()}

      {this.label('Types')}
      {this.props.stats.get('types', Immutable.Map()).sort((a, b) => b - a).map((v, k) => {
        return this.item(k, 'prettyType', k, v);
      }).valueSeq()}

    </div>
  }
});

export default OmniboxOverview;
