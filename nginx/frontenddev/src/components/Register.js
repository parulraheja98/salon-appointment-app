import React,{Component} from 'react';
import {Form,Button, NavItem, Alert} from 'react-bootstrap';
import '../App.css';
class Register extends Component {

constructor(props) {
    super(props);
    this.state = {
        username:'',
        password:'',
        confPassword:'',
        email:'',
        credentialsMatch:true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleRePassword = this.handleRePassword.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
}

handleUsername(event) {
    event.preventDefault();
    this.setState({username:event.target.value});
}

handleEmail(event) {
    event.preventDefault();
    this.setState({email:event.target.value});
}

handlePassword(event) {
    event.preventDefault();
    this.setState({password:event.target.value});
}

handleRePassword(event) {
    event.preventDefault();
    this.setState({confPassword:event.target.value});
}

handleSubmit(event) {

    event.preventDefault();
    console.log('checking username');
    console.log(this.state.username);
    console.log('checking usrname 1');
    
        var registerCredentials = JSON.stringify({
            uname:this.state.username,
            pword:this.state.password,
            email:this.state.email,
            pword2:this.state.confPassword
        })
    

    fetch('http://localhost:3017/processReg1' , {
    method:'POST',
    credentials:'include',
    headers:{'Content-Type':'application/json'},
    body:registerCredentials
    })
    .then(response => response.json())
    .then(data => {
    console.log('test completed');
    console.log(data);
    console.log('test completed 1');
    if(data.authorized) {
        this.props.history.push('/Message',{
            message:'Congratulations you are successfully registered'
        })
    }
    else {
        this.setState({credentialsMatch:false});       
    } 
    
    })
    
    }

    componentDidMount() {
       
    }

render() {

    return (

        <Form id="register" onSubmit={this.handleSubmit}>
            <Form.Label> Enter email </Form.Label>
            <Form.Control  type='text' placeholder='Enter email' onChange={this.handleEmail} required/>
            <Form.Label> Enter username</Form.Label>
            <Form.Control type='text' placeholder='Enter username' onChange={this.handleUsername} required/>
            <Form.Label> Enter password </Form.Label>
            <Form.Control type='password' placeholder='Enter password' onChange={this.handlePassword} required/>
            <Form.Label> Re Enter Password </Form.Label>
            <Form.Control type='password' placeholder='Re Enter password' onChange={this.handleRePassword} required/>
            <Button variant='primary' type='submit'> Register </Button>
            <Form.Text className="text-muted">
               {
                   this.state.credentialsMatch ?
                   null : <Alert variant='danger'> Invalid Credentials </Alert>
               }
             </Form.Text>
        </Form>


    )




}

}

export default Register;