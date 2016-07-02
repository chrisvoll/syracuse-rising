import { connect } from 'react-redux';
import App from '../components/App';
import { loadServerData } from '../AppActions';

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadServerData: () => {
      dispatch(loadServerData());
    }
  };
};

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default AppContainer;
