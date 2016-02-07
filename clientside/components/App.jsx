import React from 'react';
import { loadedServerData } from '../actions';
import axios from 'axios';
import MapContainer from '../containers/MapContainer';
import OmniboxContainer from '../containers/OmniboxContainer';
import '../styles/App.scss';

class App extends React.Component {
  componentDidMount() {
    this.unsubscribe = this.context.store.subscribe(() => this.forceUpdate());

    axios
      .get('https://spreadsheets.google.com/feeds/list/19JnF3xjfnGSLN0Gzoh-Gw2pNfbQVJYGq7XzZMYfMK-Q/od6/public/values?alt=json')
      .then(
        response => {
          let listings = response.data.feed.entry.map(listing => {
            let newListing = {};

            for (var i in listing) {
              if (i.indexOf('gsx$') !== -1) {
                newListing[i.replace('gsx$', '')] = listing[i]['$t'];
              }
            }

            return newListing;
          });

          this.context.store.dispatch(loadedServerData(listings));
        }
      )
      .catch(
        error => {
          console.error('error loading listings', error);
        }
      );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const listings = this.context.store.getState().listings;
    const els = listings
      .sort((a, b) => parseInt(b.cost.replace(/,/g, '') || 0, 10) - parseInt(a.cost.replace(/,/g, '') || 0, 10))
      .map(listing => {
        return <tr key={listing.id}>
          <td>{listing.name}</td>
          <td>{listing.cost && '$'}{listing.cost}</td>
        </tr>;
      });
    return <div>
      <MapContainer />
      <OmniboxContainer />
      <table>
        <thead>
          <tr>
            <th>
              Name
            </th>
            <th>
              Cost
            </th>
          </tr>
        </thead>

        <tbody>
          {els}
        </tbody>
      </table>
    </div>;
  }
}

App.contextTypes = {
  store: React.PropTypes.object
};

export default App;
