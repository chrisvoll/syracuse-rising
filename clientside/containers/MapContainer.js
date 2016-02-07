import { connect } from 'react-redux';
import { selectListing } from '../actions';
import Map from '../components/Map.jsx';

const mapStateToProps = (state) => {
  return {
    listings: state.listings,
    selectedListing: state.selectedListing
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelectListing: listingId => {
      dispatch(selectListing(listingId));
    }
  };
};

const MapContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);

export default MapContainer;
