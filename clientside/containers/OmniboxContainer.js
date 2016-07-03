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

  var listings = state.get('listings').sort((a, b) => b.get('cost') - a.get('cost'));

  var filterKey = state.get('filterKey');
  var filterValue = state.get('filterValue');

  if (filterKey && filterKey !== 'all') {
    listings = listings.filter(l => l.get(filterKey) === filterValue);
  }

  return {
    selectedListing,
    listings,
    stats: state.get('stats'),
    filterKey,
    filterValue
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
