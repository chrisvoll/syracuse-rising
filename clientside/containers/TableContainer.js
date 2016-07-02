import { connect } from 'react-redux';
import Table from '../components/Table';

const mapStateToProps = (state) => {
  return {
    listings: state.get('listings')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const TableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Table);

export default TableContainer;
