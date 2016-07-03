import { connect } from 'react-redux';
import App from '../components/App';
import { loadServerData,
         setSearch } from '../AppActions';

const mapStateToProps = (state) => {
  return {
    searchQuery: state.get('searchQuery')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadServerData: () => {
      dispatch(loadServerData());
    },
    onSetSearch: (query) => {
      dispatch(setSearch(query));
    }
  };
};

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default AppContainer;
