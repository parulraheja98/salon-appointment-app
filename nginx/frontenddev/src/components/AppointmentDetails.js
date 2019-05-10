import React,{Component} from 'react';
import {ListGroup,Button} from 'react-bootstrap';

class AppointmentDetails extends Component {

constructor(props) {
    super(props);
    this.state={timeValOfAppointments:'',date:'',person:'',details:''};
    this.handleSubmit = this.handleSubmit.bind(this);
}

componentDidMount() {
    var info = this.props.location.state.appointmentInfo;
    console.log('checking info 1');
    console.log(info);
    console.log(info.timeValOfAppointments);
    console.log('checking info 2');
    this.setState({
        timeValOfAppointments:info.timeValOfAppointments,
        date:info.date,
        person:info.person,
        
    })
    fetch('http://localhost:3017/detailedinfo' ,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            date:info.date,
            timeValOfAppointments:info.timeValOfAppointments

        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('checking data 1');
        console.log(data);
        console.log('checking data 2');
        this.setState({
            details:data.details
        })
    })
}

handleSubmit() {
    fetch('http://localhost:3017/processAppointment' , {
            method:'POST',
            credentials:'include',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                timeValOfAppointments:this.state.timeValOfAppointments,
                date:this.state.date,
                person:this.state.person,
                typeDesc:this.state.details.typeAppoint,
                priceDesc:this.state.details.price
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('checking data 1');
            console.log(data);
            console.log('checking data 2');
            if(data.message) {
                this.props.history.push('/Message' , {
                    message:data.message
                })
            }

            else {
                this.props.history.push('/Message' , {
                    message:data.error
                })
            }
        })

}

render() {

    return (
        <div className='appointment-details'>
        
       
        <ListGroup variant="flush">
             <ListGroup.Item variant='info'> Appointment Details </ListGroup.Item>
            <ListGroup.Item>Appointment Booked for :- {this.state.person}</ListGroup.Item>
            <ListGroup.Item>Appointment Price {this.state.details.price}</ListGroup.Item>
            <ListGroup.Item>Appointment Time {this.state.timeValOfAppointments}</ListGroup.Item>
            <ListGroup.Item>Appointment Date {this.state.date}</ListGroup.Item>
        </ListGroup>

        <Button onClick={this.handleSubmit}> Book Appointment </Button>

        
        </div>
    )
}
}

export default AppointmentDetails;