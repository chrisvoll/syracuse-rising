import { connect } from 'react-redux';
import { selectListing,
         hoverListing } from '../AppActions';
import Map from '../components/Map';

const mapStateToProps = (state) => {
  var listings = state.get('listings').sort((a, b) => b.get('cost') - a.get('cost'));

  var filterKey = state.get('filterKey');
  var filterValue = state.get('filterValue');

  if (filterKey && filterKey !== 'all') {
    listings = listings.filter(l => l.get(filterKey) === filterValue);
  }

  return {
    listings,
    selectedListing: state.get('selectedListing'),
    hoveredListing: state.get('hoveredListing')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelectListing: listingId => {
      dispatch(selectListing(listingId));
    },

    onHoverListing: listingId => {
      dispatch(hoverListing(listingId));
    }
  };
};

const MapContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);

export default MapContainer;
