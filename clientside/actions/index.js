export const loadedServerData = (data) => {
  return {
    type: 'LOADED_SERVER_DATA',
    data
  };
};

export const selectListing = (listingId) => {
  return {
    type: 'SELECT_LISTING',
    listingId
  };
};

export const deselectListing = () => {
  return {
    type: 'DESELECT_LISTING'
  };
};
