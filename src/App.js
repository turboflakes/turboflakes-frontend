import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import LayoutV2 from './components/pages/layout_v2'
import IndexPageV2 from './components/pages/index_page_v2'
import Layout from './components/pages/layout'
import IndexPage from './components/pages/index_page'
import AboutPage from './components/pages/about_page'
import DisclaimerPage from './components/pages/disclaimer_page'
import withTheme from './theme/withTheme'


function LayoutRoute({
  layout: Layout,  
  page: Page,  
  ...rest
}) {
  return (
    <Route {...rest} render={(props) =>
      <Layout {...props}>
        <Page {...props} />
      </Layout>
    } />
  );
}

function App() {
  return (
      <Router>
        <Switch>
          <LayoutRoute exact path="/" layout={LayoutV2} page={IndexPageV2} />
          <LayoutRoute exact path="/v1" layout={Layout} page={IndexPage} />
          <LayoutRoute exact path="/about" layout={Layout} page={AboutPage} />
          <LayoutRoute exact path="/disclaimer" layout={Layout} page={DisclaimerPage} />
          <Redirect to="/" />
        </Switch>
      </Router>
  );
}

export default withTheme(App);
