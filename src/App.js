import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './index.css';
import Home from './Home/Home';
import BuzzRoom from './BuzzRoom/BuzzRoom';
import Host from './Host/Host';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/host' component={Host} />
        <Route exact path='/host/:roomCode' component={Host} />
        <Route exact path='/:token' component={BuzzRoom} />
      </Switch>
    </Router>
  );
}

export default App;
