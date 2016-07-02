import Immutable from 'immutable';
import {
  LOADED_SERVER_DATA,
  HOVER_LISTING,
  SELECT_LISTING,
  DESELECT_LISTING
} from './AppActions';

const defaultState = Immutable.fromJS({
  listings: [],
  selectedListing: null,
  hoveredListing: null
})

const store = (state = defaultState, action) => {
  switch (action.type) {
  case LOADED_SERVER_DATA:
    state = state.set('listings', Immutable.fromJS(action.data));
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
  }

  return state;
}

export default store;
