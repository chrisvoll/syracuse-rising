import React from 'react';
import Animation from 'react-addons-css-transition-group';
import OmniboxDetail from './OmniboxDetail';
import OmniboxListings from './OmniboxListings';

import '../styles/Omnibox.scss';

var Omnibox = React.createClass({
  propTypes: {
    listings: React.PropTypes.object,
    selectedListing: React.PropTypes.object,

    onHoverListing: React.PropTypes.func,
    onSelectListing: React.PropTypes.func
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
    return !!this.props.selectedListing;
  },

  goBack() {
    this.props.onSelectListing();
  },

  render() {
    return <div className="omnibox">

      {this.canGoBack() &&
        <div className="omnibox__head omnibox__head--back" onClick={this.goBack}>
          Back to All Projects
        </div>
      }

      {!this.canGoBack() &&
        <div className="omnibox__head">
          All Projects
        </div>
      }

      <div className="omnibox__body">
        <div className={'omnibox__slider omnibox__slider--' + (this.props.selectedListing ? '2' : '1')}>

          {/*<div className="omnibox__slider__slide">
            welcome!
          </div>*/}

          <div className="omnibox__slider__slide">
            <OmniboxListings
              listings={this.props.listings}
              onHoverListing={this.props.onHoverListing}
              onSelectListing={this.props.onSelectListing} />
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
