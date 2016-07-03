import { connect } from 'react-redux';
import { selectListing,
         hoverListing,
         setFilter } from '../AppActions';
import Omnibox from '../components/Omnibox';

const mapStateToProps = (state) => {
  let selectedListing = null;
  const selectedListings = state.get('listings').filter(l => l.get('id') === state.get('selectedListing'));

  if (selectedListings.size) {
    selectedListing = selectedListings.first();
  }

  return {
    selectedListing,
    listings: state.get('listings'),
    stats: state.get('stats'),
    filterKey: state.get('filterKey'),
    filterValue: state.get('filterValue'),
    searchQuery: state.get('searchQuery')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onHoverListing: (id) => {
      dispatch(hoverListing(id));
    },
    onSelectListing: (id) => {
      dispatch(selectListing(id));
    },
    onSetFilter: (key, value) => {
      dispatch(setFilter(key, value));
    }
  };
};

const OmniboxContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Omnibox);

export default OmniboxContainer;
