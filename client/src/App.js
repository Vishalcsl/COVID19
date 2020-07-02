import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import Home from './Components/Home';
import IndiaMap from './Components/IndiaMap';
import CountryInfo from './Components/CountryInfo';
import Survey from './Components/Survey';

class App extends React.Component {
  render() {

    return (
      <Router>
        <div className="App">
          <nav className="navbar navbar-expand-lg  bg-dark">
            <a className="navbar-brand" href="#">COVID INFO SITE</a>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <a className="nav-link" href="/home">Home<span className="sr-only">(current)</span></a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/india">India Detailed Info</a>
                </li>
              </ul>
              <span className="navbar-text">
                <a href="/survey">Take the Survey</a>
              </span>
            </div>
          </nav>

          <div>
            <Switch>
              <Route exact path={["/", "/home"]} component={Home} />
              <Route exact path="/india" component={IndiaMap} />
              <Route exact path="/info/:code/:countryName" component={CountryInfo} />
              <Route exact path="/survey" component={Survey} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }


}

export default App;
