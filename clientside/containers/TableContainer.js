import { connect } from 'react-redux';
import Table from '../components/Table';

function intCost(cost) {
  return parseInt(cost.replace(/,/g, '') || 0, 10);
}

const mapStateToProps = (state) => {
  return {
    listings: state.get('listings').sort((a, b) => {
      return intCost(b.get('cost')) - intCost(a.get('cost'));
    })
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
