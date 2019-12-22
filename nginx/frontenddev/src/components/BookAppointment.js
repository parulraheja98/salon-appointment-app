import React,{Component} from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import {withCookies,Cookies} from 'react-cookie';
import {Form,Button,Dropdown,DropdownButton,Alert} from 'react-bootstrap';


class BookAppointment extends Component {

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {selDate:Date.now(),availTimings:[] , desc:''};
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBooking = this.handleBooking.bind(this);
        this.handleDesc = this.handleDesc.bind(this);
    }

    componentDidMount() {


    }

    handleDesc(event) {
       
        this.setState({desc:event.target.value});

    }

    handleSubmit() {
        fetch('http://localhost:3017/searchAppointment' ,{
            method:'POST',
            credentials:'include',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                date:this.state.selDate,
                desc:this.state.desc
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.listOfTimes) {
            this.setState({availTimings:data.listOfTimes})
            }
            else {
                this.setState({availTimings:false});
            }
        })
    }

    handleDateChange(date) {
        this.setState({selDate:date});
    }

    handleBooking(event,time) {
        const {cookies} = this.props;
        this.props.history.push('/appointmentinfo' ,{
            appointmentInfo:{
                timeValOfAppointments:time,
                date:this.state.selDate,
                person:cookies.get('loginCredentials')
            }
        })
    }

    render() {

        return (
            <Form className='book-appointment'>
                
                <Form.Group>
                    <Form.Label> Search For a Date for Appointment </Form.Label>
                    <Form.Control type='date' onChange={event => {this.handleDateChange(event.target.value)}} />
                </Form.Group>
                <select onChange={this.handleDesc}>
                    <option  value=''> -- select a type of appointment -- </option>
                    <option value='men haircut'> Men Haircut </option>
                    <option value='women haircut'> Women Haircut </option>
                    <option value='kid haircut'> Kid's Haircut </option>
                
                </select>
                <br />
              
                <Button onClick={this.handleSubmit}> Search for Appointments </Button> 
                <br />
                {
                    this.state.availTimings ?
                    this.state.availTimings.map((timings) => (
                        <>
                        <Button onClick={(event) => this.handleBooking(event,timings)}> {timings} </Button> {" "}
                        </>
                    )) : 
                    <>
                    <br />
                    <Alert variant='danger'> Sorry No Appointments available at this time </Alert>
                    </>
                }

            </Form>
        )
    }
}

export default withCookies(BookAppointment);
