import { connect } from 'react-redux';
import { selectListing,
         hoverListing } from '../AppActions';
import Map from '../components/Map';

const mapStateToProps = (state) => {
  return {
    listings: state.listings,
    selectedListing: state.selectedListing,
    hoveredListing: state.hoveredListing
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
