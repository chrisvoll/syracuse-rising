import Immutable from 'immutable';
import {
  LOADED_SERVER_DATA,
  HOVER_LISTING,
  SELECT_LISTING,
  DESELECT_LISTING,
  SET_FILTER
} from './AppActions';

const defaultState = Immutable.fromJS({
  rawListings: [],
  listings: [], // filtered, sorted
  stats: {},
  selectedListing: null,
  hoveredListing: null,

  filterKey: null, // neighborhood|type
  filterValue: null // Downtown|etc.
});

const store = (state = defaultState, action) => {
  switch (action.type) {
  case LOADED_SERVER_DATA:
    state = state.set('rawListings', action.data);
    state = state.set('listings', action.data);
    state = state.set('stats', action.stats);
    break;
  case HOVER_LISTING:
    state = state.set('hoveredListing', action.listingId);
    break;
  case SELECT_LISTING:
    state = state.set('selectedListing', action.listingId);
    break;
  case DESELECT_LISTING:
    state = state.set('selectedListing', null);
    break;
  case SET_FILTER:
    if (state.get('filterKey') === action.key && state.get('filterValue') === action.value) break;
    state = state.set('filterKey', action.key);
    state = state.set('filterValue', action.value);

    var listings = state.get('rawListings');
    if (action.key && action.key !== 'all') {
      listings = listings.filter(l => l.get(action.key) === action.value);
    }
    listings = listings.sort((a, b) => b.get('cost') - a.get('cost'));
    state = state.set('listings', listings);
    break;
  }

  return state;
}

export default store;
