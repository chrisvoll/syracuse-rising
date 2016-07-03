import { connect } from 'react-redux';
import { selectListing,
         hoverListing } from '../AppActions';
import Map from '../components/Map';

const mapStateToProps = (state) => {
  return {
    listings: state.get('listings'),
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
