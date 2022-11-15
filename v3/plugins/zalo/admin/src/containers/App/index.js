import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { LoadingIndicatorPage } from 'strapi-helper-plugin';
import pluginId from '../../pluginId';
import DataProvider from '../../hooks/DataProvider';

//import icons from './utils/icons.json';
import AppStyles from '../../styles/AppStyles';

const HomePage = lazy(() => import('../HomePage'));
//const EditPage = lazy(() => import('../EditPage'));

const App = () => {

  return (
    <AppStyles>      
      <Suspense fallback={<LoadingIndicatorPage />}>
        <Switch>
          <Route exact path={`/plugins/${pluginId}`}>
            <DataProvider><HomePage/></DataProvider>
          </Route>            
          {/* <Route exact path={`/${strapi.org}/${pluginId}/:uid`}>
            <DataProvider><EditPage/></DataProvider>              
          </Route> */}
        </Switch>
      </Suspense>      
    </AppStyles>
  );
};

export default App;
