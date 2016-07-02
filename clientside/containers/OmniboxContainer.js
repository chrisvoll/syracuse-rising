import { connect } from 'react-redux';
import { selectListing,
         deselectListing } from '../AppActions';
import Omnibox from '../components/Omnibox';

const mapStateToProps = (state) => {
  let selectedListing = null;
  const selectedListings = state.get('listings').filter(l => l.get('id') === state.get('selectedListing'));
  if (selectedListings.size) {
    selectedListing = selectedListings.first();
  }
  return { selectedListing };
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
