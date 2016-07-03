import Immutable from 'immutable';
import {
  LOADED_SERVER_DATA,
  HOVER_LISTING,
  SELECT_LISTING,
  DESELECT_LISTING,
  SET_FILTER,
  SET_SEARCH
} from './AppActions';

const defaultState = Immutable.fromJS({
  rawListings: [],
  listings: [], // filtered, sorted
  stats: {},
  selectedListing: null,
  hoveredListing: null,

  filterKey: 'all', // neighborhood|type
  filterValue: null, // Downtown|etc.

  searchQuery: ''
});

const sortFn = (a, b) => b.get('cost') - a.get('cost');

const store = (state = defaultState, action) => {
  switch (action.type) {

  case LOADED_SERVER_DATA:
    var listings = action.data.sort(sortFn);
    state = state.set('rawListings', listings);
    state = state.set('listings', listings);
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
    state = state.set('searchQuery', '');

    var listings = state.get('rawListings');
    if (action.key && action.key !== 'all') {
      listings = listings.filter(l => l.get(action.key) === action.value);
    }

    state = state.set('listings', listings);
    break;

  case SET_SEARCH:
    if (state.get('searchQuery') === action.query) break;
    state = state.set('filterKey', 'all');
    state = state.set('filterValue', null);
    state = state.set('selectedListing', null);

    var listings = state.get('rawListings');
    var query = action.query.toLowerCase();

    if (action.query) {
      listings = listings.filter(l => l.get('name', '').toLowerCase().indexOf(query) >= 0 || l.get('description', '').toLowerCase().indexOf(query) >= 0);
    }

    state = state.set('searchQuery', action.query);
    state = state.set('listings', listings);
    break;
  }

  return state;
}

export default store;
