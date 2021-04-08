import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { ProductListing } from './components/product-listing/ProductListing'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
});

function App() {
  return (
      <ApolloProvider client={client}>
          <Router>
              <Switch>
                  <Route path="/" exact={true}>
                      <ProductListing />
                  </Route>
              </Switch>
          </Router>
      </ApolloProvider>
  );
}

export default App;
