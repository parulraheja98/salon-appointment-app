import React,{Component} from 'react';
import {Nav,Navbar} from 'react-bootstrap';
import '../App.css';
import {withCookies,Cookies} from 'react-cookie';
import {withRouter,Redirect} from 'react-router-dom';
class NavigationBar extends Component {

constructor(props) {
    super(props);
    this.state={loggedIn:false,loginInfo:'',hour:'',adminAccess:false};
    this.logout = this.logout.bind(this);
    this.getHour = this.getHour.bind(this);
}

logout(event) {
    const {cookies} = this.props;
    cookies.remove('loginCredentials' , {path:'/'});
    this.props.history.push('/');

}

getHour() {
    var date = new Date();
    var hour = date.getHours();
    console.log('just check');
    this.setState({hour});

}

componentDidMount() {
    const {cookies} = this.props;
    if(cookies.get('loginCredentials')) {
        if(cookies.get('loginCredentials') == 'admin') {
            this.setState({adminAccess:true});
        }
        console.log('first check');
        console.log(cookies.get('loginCredentials'));
        console.log('second check');
        this.setState({loggedIn:true,loginInfo:cookies.get('loginCredentials')});
    }
    else {
        console.log('second check');
        this.setState({loggedIn:false});
    }
    this.getHour();

}

componentDidUpdate(prevProps, prevState) {
    console.log('previous state check 1');
    var loginCheck = prevProps.cookies.cookies.loginCredentials;
    if(!prevState.loggedIn && loginCheck) {
        this.setState({loggedIn:true,loginInfo:loginCheck});
        if(loginCheck == 'admin') {
            this.setState({adminAccess:true});
        }

    }

    if(prevState.loggedIn && loginCheck == undefined) {
        this.setState({loggedIn:false});
    }
    
  
}


render() {

    return (
        this.state.loggedIn ?
            
        <Navbar bg="dark" variant="dark">
            <Nav className="mr-auto" style={{width:'100%'}}>
           
                <Nav.Link className='header'> Welcome {this.state.loginInfo} 
                {
                    this.state.hour < 12 ? <span > Good Morning</span>
                    : <span > Good Evening</span>
                }
                
                </Nav.Link>
                
            <Nav.Link href="/Register" style={{marginLeft:'auto'}}> Register </Nav.Link>
            {this.state.adminAccess ?
                <Nav.Link href="/adminpanel"> Admin Panel </Nav.Link>
                : null
            }
            <Nav.Link href='/userpanel'> User Panel </Nav.Link>
            <Nav.Link href="/bookappointment"> Book Appointment </Nav.Link>
            <Nav.Link onClick={this.logout} className='testing'> Logout </Nav.Link>
            </Nav>
        </Navbar>
                : null





    )

}

}

const NavigateBar = withCookies(NavigationBar);
export default withRouter(NavigateBar);