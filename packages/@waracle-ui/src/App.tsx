import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from 'apollo-upload-client';
import { ImageListing } from './pages/image-listing/ImageListing'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'

const client = new ApolloClient({
    link: new createUploadLink({ uri: 'http://localhost:4000/graphql'}),
    cache: new InMemoryCache()
});

function App() {
  return (
      <ApolloProvider client={client}>
          <Router>
              <Switch>
                  <Route path="/" exact={true}>
                      <ImageListing />
                  </Route>
              </Switch>
          </Router>
      </ApolloProvider>
  );
}

export default App;
