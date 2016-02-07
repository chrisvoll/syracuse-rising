const selectedListing = (state = null, action) => {
  switch (action.type) {
  case 'SELECT_LISTING':
    return action.listingId;
  case 'DESELECT_LISTING':
    return null;
  default:
    return null;
  }
};

export default selectedListing;
