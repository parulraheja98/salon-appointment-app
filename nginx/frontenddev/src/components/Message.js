import React,{Component} from 'react';
import {Alert} from 'react-bootstrap';

class Message extends Component {

constructor(props) {
    super(props);
    this.state = {message:''};

}

componentDidMount() {
var message = this.props.location.state.message;
this.setState({message});


}

render() {

    return (

        <div className='message-container'>
        {this.state.message ?
        <Alert variant='info'> {this.state.message} </Alert>
            : null
        }
        
        
        </div>



    )


}



}
export default Message;