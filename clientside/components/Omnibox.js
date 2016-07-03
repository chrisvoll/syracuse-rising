import React from 'react';
import Animation from 'react-addons-css-transition-group';
import OmniboxOverview from './OmniboxOverview';
import OmniboxListings from './OmniboxListings';
import OmniboxDetail from './OmniboxDetail';

import '../styles/Omnibox.scss';

var Omnibox = React.createClass({
  propTypes: {
    listings: React.PropTypes.object,
    stats: React.PropTypes.object,
    selectedListing: React.PropTypes.object,
    filterKey: React.PropTypes.string,
    filterValue: React.PropTypes.string,

    onHoverListing: React.PropTypes.func,
    onSelectListing: React.PropTypes.func,
    onSetFilter: React.PropTypes.func
  },

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  },

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  },

  handleKeyDown(e) {
    if (e.keyCode === 27 && this.canGoBack()) {
      this.goBack();
    }
  },

  canGoBack() {
    return this.props.selectedListing || this.props.filterKey;
  },

  goBack() {
    var state = this.getSlideState();

    if (state === 2) {
      this.props.onSetFilter();
    } else if (state === 3) {
      this.props.onSelectListing();
    }
  },

  getSlideState() {
    if (this.props.selectedListing) {
      return 3;
    }
    if (this.props.filterKey) {
      return 2;
    }
    return 1;
  },

  render() {
    var slide = this.getSlideState();

    return <div className="omnibox">

      {this.canGoBack() &&
        <div className="omnibox__head omnibox__head--back" onClick={this.goBack}>
          Back to {slide === 3 ? 'Projects' : 'Overview'}
        </div>
      }

      {!this.canGoBack() &&
        <div className="omnibox__head">
          All Projects
        </div>
      }

      <div className="omnibox__body">
        <div className={'omnibox__slider omnibox__slider--' + slide}>

          <div className="omnibox__slider__slide">
            <OmniboxOverview
              stats={this.props.stats}
              onSetFilter={this.props.onSetFilter} />
          </div>

          <div className="omnibox__slider__slide">
            <OmniboxListings
              listings={this.props.listings}
              onHoverListing={this.props.onHoverListing}
              onSelectListing={this.props.onSelectListing}
              filterValue={this.props.filterValue} />
          </div>

          <div className="omnibox__slider__slide">
            <Animation transitionName="omnibox-animation" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
              {this.props.selectedListing &&
                <OmniboxDetail
                  key="detail"
                  listing={this.props.selectedListing} />
              }
            </Animation>
          </div>

        </div>
      </div>
    </div>;
  }
});

export default Omnibox;
