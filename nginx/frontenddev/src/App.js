import React, { Component } from 'react';
import {Switch,Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Admin from './components/Admin';
import BookAppointment from './components/BookAppointment';
import Register from './components/Register';
import Login from './components/Login';
import Message from './components/Message';
import AppointmentDetails from './components/AppointmentDetails';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <div>
        
        <Switch>
          <Route exact path='/adminpanel' component={Admin} />
          <Route exact path='/bookappointment' component={BookAppointment} />
          <Route exact path='/Login' component={Login} />
          <Route exact path='/Register' component={Register} />
          <Route exact path='/message' component={Message} />
          <Route exact path='/appointmentinfo' component={AppointmentDetails} />
        </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
