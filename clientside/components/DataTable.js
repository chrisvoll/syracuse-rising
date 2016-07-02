import React from 'react';
import DataTableItem from './DataTableItem';

export default const DataTable extends React.Component {
  render() {
    return <div>
      {this.props.children}
    </div>;
  }
}
