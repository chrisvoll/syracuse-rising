import { connect } from 'react-redux';
import { selectListing } from '../actions';
import Omnibox from '../components/Omnibox.jsx';

const mapStateToProps = (state) => {
  let selectedListing = null;
  const selectedListings = state.listings.filter(l => l.id === state.selectedListing);
  if (selectedListings.length) {
    selectedListing = selectedListings[0];
  }
  return {
    selectedListing
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDeselectListing: () => {
      dispatch(deselectListing());
    }
  };
};

const OmniboxContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Omnibox);

export default OmniboxContainer;
