import { combineReducers } from 'redux';
import listings from './listings';
import selectedListing from './selectedListing';

const store = combineReducers({
  listings,
  selectedListing
});

export default store;
