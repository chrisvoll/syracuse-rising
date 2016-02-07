const listings = (state = [], action) => {
  switch (action.type) {
  case 'LOADED_SERVER_DATA':
    return action.data;
  default:
    return state;
  }
};

export default listings;
