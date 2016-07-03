import axios from 'axios';
import Immutable from 'immutable';
import util from './util';

export const loadServerData = () => {
  return dispatch => {
    axios
      .get('https://spreadsheets.google.com/feeds/list/19JnF3xjfnGSLN0Gzoh-Gw2pNfbQVJYGq7XzZMYfMK-Q/od6/public/values?alt=json')
      .then(response => {
        var neighborhoods = {};
        var types = {};

        var listings = response.data.feed.entry
          .map(listing => {
            let newListing = {};

            for (var i in listing) {
              if (i.indexOf('gsx$') !== -1) {
                newListing[i.replace('gsx$', '')] = listing[i]['$t'];
              }
            }

            newListing.cost = util.normalizeCost(newListing.cost);

            neighborhoods[newListing.neighborhood] = (neighborhoods[newListing.neighborhood] || 0) + newListing.cost;
            types[newListing.type] = (types[newListing.type] || 0) + newListing.cost;

            return newListing;
          })
          .filter(l => l.status !== 'canceled');

        dispatch(loadedServerData(Immutable.fromJS(listings), Immutable.fromJS({ neighborhoods, types })));
      })
      .catch(error => {
        console.error('error loading listings', error);
      });
  };
};

export const LOADED_SERVER_DATA = 'LOADED_SERVER_DATA';
export const loadedServerData = (data, stats) => {
  return {
    type: LOADED_SERVER_DATA,
    data,
    stats
  };
};

export const SELECT_LISTING = 'SELECT_LISTING';
export const selectListing = (listingId) => {
  return {
    type: SELECT_LISTING,
    listingId
  };
};

export const DESELECT_LISTING = 'DESELECT_LISTING';
export const deselectListing = () => {
  return {
    type: DESELECT_LISTING
  };
};

export const HOVER_LISTING = 'HOVER_LISTING';
export const hoverListing = (listingId) => {
  return {
    type: HOVER_LISTING,
    listingId
  };
};

export const SET_FILTER = 'SET_FILTER';
export const setFilter = (key, value) => {
  return {
    type: SET_FILTER,
    key,
    value
  };
};
