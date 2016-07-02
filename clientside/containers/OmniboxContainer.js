import { connect } from 'react-redux';
import { selectListing,
         hoverListing } from '../AppActions';
import Omnibox from '../components/Omnibox';

function intCost(cost) {
  return parseInt(cost.replace(/,/g, '') || 0, 10);
}

const mapStateToProps = (state) => {
  let selectedListing = null;
  const selectedListings = state.get('listings').filter(l => l.get('id') === state.get('selectedListing'));

  if (selectedListings.size) {
    selectedListing = selectedListings.first();
  }

  return {
    selectedListing,
    listings: state.get('listings').sort((a, b) => intCost(b.get('cost')) - intCost(a.get('cost')))
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onHoverListing: (id) => {
      dispatch(hoverListing(id));
    },
    onSelectListing: (id) => {
      dispatch(selectListing(id));
    }
  };
};

const OmniboxContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Omnibox);

export default OmniboxContainer;
