import React from 'react';
import ReactDOM from 'react-dom';
import {redA200} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import Home from './components/home.jsx';
import Signup from './components/signup.jsx';
import Login from './components/login.jsx';
import Input from './components/input.jsx';
import Results from './components/results.jsx';
import Types from './components/types.jsx';
import Waiting from './components/wating.jsx';
import Dummy from './components/dummy.jsx';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Image from './components/image.jsx'
import axios from 'axios';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: redA200,
    primary2Color: redA200
  }
});

const style = {
  nav:  {
    backgroundColor: '#FF5252',
    marginBottom: '10%'
  }
}

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      currentUser: null,
      imageUrl: 'https://avatars1.githubusercontent.com/u/29010046?s=460&v=4',
      appView: 'login',
      location: '',
      peopleNum: '',
      distance: '',
      budget: '',
      wantToEat: [],
      willNotEat: [],
      errorText: '',
      counter: 1,
      results: [],
      open: false,
      prefs: {},
      currentgroup: ''
    };
    this.clickHandle = this.clickHandle.bind(this);
    this.changeHandle = this.changeHandle.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.betterUpdateState = this.betterUpdateState.bind(this);
    this.updateGroup = this.updateGroup.bind(this);
  }

  updateUser(username) {
    this.setState({currentUser: username});
  }

  updateImage(imageUrl) {
    this.setState({imageUrl: imageUrl});
  }

  updateGroup(title) {
    this.setState({currentgroup: title});
    console.log('currentgroup in index', this.state.currentgroup)
  }

  foodsYUM() {
    return (
      <section>
        <ul>
          <li>
            <figure className="meal-photo">
            </figure>
          </li>
          <li>
            <figure className-"meal-photo">
            </figure>
          </li>
          <li>
            <figure className="meal-photo">
            </figure>
          </li>
          <li>
            <figure className="meal-photo">
            </figure>
          </li>
        </ul>
        <ul>
          <li>
            <figure className="meal-photo">

            </figure>
          </li>
          <li>
            <figure className="meal-photo">
            </figure>
          </li>
          <li>
            <figure className="meal-photo">
            </figure>
          </li>
          <li>
            <figure className="meal-photo">
            </figure>
          </li>
        </ul>
      </section>
    )
  }

  submitForm() {
    let data = {
      location: this.state.location,
      budget: this.state.budget,
      radius: this.state.distance,
      wantToEat: this.state.wantToEat,
      willNotEat: this.state.willNotEat
    };

    console.log('submitting', data);

    axios.post('/input/findRestaurants', data)
    .then( (response) => {
      this.setState({ results: response.data }, () => this.clickHandle('results'));
    });

    let dataAndUser = {
      location: this.state.location,
      budget: this.state.budget,
      radius: this.state.distance,
      wantToEat: this.state.wantToEat,
      willNotEat: this.state.willNotEat,
      username: this.state.currentUser
    }

    axios.post('/update', data)
    .then( (response) => {
      this.setState({ prefs: data }); //made a state to pass to prefs.jsx
    });

    axios.post('/group', {title: this.state.currentgroup, location: this.state.location, people: this.state.currentUser})
    .then((res) => console.log('new group post succeed in index', res))
    .catch((err) => console.log('new group post error in index', err));
  }


  // handles empty value errors in input.jsx
  errorHandle(val) {
    if (val === '') {
      this.setState({
        errorText: 'Required'
      });
    }
  }

  betterUpdateState(value) {
    this.setState({appView: value});
  }

  // catches which input field in input.jsx the user in entering information into,
  // takes the value, updates the corresponding state with that value
  updateState(e, val) {
    val === undefined ? val = e.target.value : val;  // catch location input field value since it behaves differently
    let key = e.target.name;
    // you must use a function to set state if the key is a variable
    let stateObj = function() {
      var obj = {};
      obj[key] = val;
      return obj;
    }.bind(e)();
    this.setState( stateObj );

  }

  // handles button clicks at the bottom of the app as forms are completed and
  // changes the current view
  clickHandle(view) {
    // this if statement handles how many types.jsx forms are loaded based on peopleNum
    if (view === 'waiting') { // if view equals 'waiting', that means a typs.jsx for was just submitted
      if (this.state.counter < this.state.peopleNum) { // check to see if everyone has submitted a form
        let increment = this.state.counter + 1;
        // we have to set the appView to a dummy page briefly, which in turn loads
        // another types page, otherwise the checkboxes won't reset
        this.setState({ counter: increment, appView: 'dummy' });
      } else {
        // when everyone has filled out a types.jsx form, comtinue to the waiting page
        this.setState({ appView: view }, () => this.submitForm() );
      }
    } else if (view === 'home') {
      // resets all user inputted states
      this.setState({
        appView: 'home',
        location: '',
        peopleNum: '',
        distance: '',
        budget: '',
        wantToEat: [],
        willNotEat: [],
        errorText: '',
        counter: 1,
        results: [],
        open: false
      })
    } else {
      this.setState({ appView: view, open: false });
    }
  }

  // handles changes in input fields from input.jsx
  // and routes to handle errors and to constantly update this state
  changeHandle(e, i, val) {
    this.errorHandle(val);
    this.updateState(e, val);
  }

  // handles icon menu drawer visibility
  handleToggle() {
    this.setState({open: !this.state.open});
  }

  handleLogout() {
    axios.get('/logout')
      .then((response) => {
        console.log('Successfully loggedout')
        this.clickHandle('login');
        this.setState({ open: false, username: null});
      })
      .catch((error) => {
        console.log('error logging out', error)
      })
  }

  render() {
    if (this.state.appView === 'home') {
      return (
        <div>
          <MuiThemeProvider muiTheme={muiTheme}>
            <AppBar title="uChews"
                    style={style.nav}
                    onLeftIconButtonTouchTap={this.handleToggle}/>
            <Drawer docked={false}
                    width={200}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}>
                    <MenuItem onClick={() => this.clickHandle('home')}>
                        HOME
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={this.handleLogout}>LOGOUT</MenuItem>
                    <Divider />
            </Drawer>
            <Home betterUpdateState={this.betterUpdateState} imageUrl={this.state.imageUrl} currentUser={this.state.currentUser} appView={this.state.appView}
                  clickHandle={this.clickHandle} prefs={this.state.prefs}
                  updateGroup={this.updateGroup} />
          </MuiThemeProvider>
        </div>
      )
    } else if (this.state.appView === 'login') {
      return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <AppBar
            title="uChews"
            style={style.nav}
            showMenuIconButton={false}
            />
          <Login updateUser={this.updateUser} appView={this.state.appView} clickHandle={this.clickHandle}/>
        </MuiThemeProvider>
      )
    } else if (this.state.appView === 'input') {
      return (
        <div>
          <MuiThemeProvider muiTheme={muiTheme}>
            <AppBar title="uChews"
                    style={style.nav}
                    onLeftIconButtonTouchTap={this.handleToggle}/>
            <Drawer docked={false}
                    width={200}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}>
                    <MenuItem onClick={() => this.clickHandle('home')}>
                        HOME
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={this.handleLogout}>LOGOOUT</MenuItem>
                    <Divider />
            </Drawer>
            <Input data={this.state.data}
                   clickHandle={this.clickHandle}
                   changeHandle={this.changeHandle}
                   errorText={this.state.errorText}
                   currentgroup={this.state.currentgroup} />
          </MuiThemeProvider>
        </div>
      )
    } else if (this.state.appView === 'types') {
      return (
        <div>
          <MuiThemeProvider muiTheme={muiTheme}>
            <AppBar title="uChews"
                    style={style.nav}
                    onLeftIconButtonTouchTap={this.handleToggle}/>
            <Drawer docked={false}
                    width={200}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}>
                    <MenuItem onClick={() => this.clickHandle('home')}>
                        HOME
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={this.handleLogout}>LOGOUT</MenuItem>
                    <Divider />
            </Drawer>
            <Types clickHandle={this.clickHandle}
                   counter={this.state.counter}
                   willNotEat={this.state.willNotEat}
                   wantToEat={this.state.wantToEat}/>
          </MuiThemeProvider>
        </div>
      )
    } else if (this.state.appView === 'waiting') {
      return (
        <div>
          <MuiThemeProvider muiTheme={muiTheme}>
            <AppBar title="uChews"
                    style={style.nav}
                    onLeftIconButtonTouchTap={this.handleToggle}/>
            <Drawer docked={false}
                    width={200}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}>
                    <MenuItem onClick={() => this.clickHandle('home')}>
                        HOME
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={this.handleLogout}>HOME</MenuItem>
                    <Divider />
            </Drawer>
            <Waiting submitForm={this.submitForm} />
          </MuiThemeProvider>
        </div>
      )
    } else if (this.state.appView === 'results') {
      return (
        <div>
          <MuiThemeProvider muiTheme={muiTheme}>
            <AppBar title="uChews"
                    style={style.nav}
                    onLeftIconButtonTouchTap={this.handleToggle}/>
            <Drawer docked={false}
                    width={200}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}>
                    <MenuItem onClick={() => this.clickHandle('home')}>
                        HOME
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={this.handleLogout}>LOGOUT</MenuItem>
                    <Divider />
            </Drawer>
            <Results clickHandle={this.clickHandle}
                     results={this.state.results} />
          </MuiThemeProvider>
        </div>
      )
    } else if (this.state.appView === 'signup') {
      return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <AppBar
              title="uChews"
              style={style.nav}
              showMenuIconButton={false}
              />
          <Signup appView={this.state.appView} clickHandle={this.clickHandle}
                  clickHandle={this.clickHandle}
                  googleClick={this.googleClick}/>
        </MuiThemeProvider>
      )
    } else if (this.state.appView === 'dummy') {
      return (
        <Dummy clickHandle={this.clickHandle} />
      )
    } else if (this.state.appView === 'image') {
      return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <AppBar
              title="uChews"
              style={style.nav}
              showMenuIconButton={false}
              />
            <Image currentUser={this.state.currentUser} imageUrl={this.state.imageUrl} clickHandle={this.clickHandle} updateImage={this.updateImage}/>
        </MuiThemeProvider>
      )
    }
  }
}

ReactDOM.render(<Index/>, document.getElementById('app'));