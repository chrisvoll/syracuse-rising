import React from 'react';

var Table = React.createClass({
  propTypes: {
    listings: React.PropTypes.object
  },

  render() {
    return <div className="table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Type</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {this.props.listings.map(l => {
            return <tr key={l.get('id')}>
              <td>{l.get('name')}</td>
              <td>{l.get('location')}</td>
              <td>{l.get('type')}</td>
              <td>{l.get('cost') && '$'}{l.get('cost')}</td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>;
  }
});

export default Table;
