import axios from 'axios';

export const loadServerData = () => {
  return dispatch => {
    axios
      .get('https://spreadsheets.google.com/feeds/list/19JnF3xjfnGSLN0Gzoh-Gw2pNfbQVJYGq7XzZMYfMK-Q/od6/public/values?alt=json')
      .then(response => {
        let listings = response.data.feed.entry.map(listing => {
          let newListing = {};

          for (var i in listing) {
            if (i.indexOf('gsx$') !== -1) {
              newListing[i.replace('gsx$', '')] = listing[i]['$t'];
            }
          }

          return newListing;
        });

        dispatch(loadedServerData(listings));
      })
      .catch(error => {
        console.error('error loading listings', error);
      });
  };
};

export const LOADED_SERVER_DATA = 'LOADED_SERVER_DATA';
export const loadedServerData = (data) => {
  return {
    type: LOADED_SERVER_DATA,
    data
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
