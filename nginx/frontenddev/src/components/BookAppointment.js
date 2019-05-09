import React,{Component} from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import {withCookies,Cookies} from 'react-cookie';

class BookAppointment extends Component {

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {selDate:Date.now(),availTimings:[]};
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBooking = this.handleBooking.bind(this);
    }

    componentDidMount() {


    }

    handleSubmit() {
        console.log('date check 1');
        console.log(this.state.selDate);
        console.log('date check 2');
        fetch('http://localhost:3017/searchAppointment' ,{
            method:'POST',
            credentials:'include',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                date:this.state.selDate
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.appoint.length > 0 ) {
            console.log('checking data 1');
            console.log(data);
            this.setState({availTimings:data.appoint[0].timings})
            console.log('checking data 2');
            }
            else {
                this.setState({availTimings:false});
            }
        })
    }

    handleDateChange(date) {
        console.log('checking date 1');
        console.log(date);
        this.setState({selDate:date});
        console.log('checking date 2');
    }

    handleBooking(event,time) {
        const {cookies} = this.props;
        console.log('checking time 1');
        console.log(time);
        console.log(this.state);
        console.log('checking time 2');
        fetch('http://localhost:3017/processAppointment' , {
            method:'POST',
            credentials:'include',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                timeValOfAppointments:time,
                date:this.state.selDate,
                person:cookies.get('loginCredentials')
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('checking data 1');
            console.log(data);
            console.log('checking data 2');
        })
    }

    render() {

        return (
            <div className='book-appointment'>
                <input type='date' onChange={event => {this.handleDateChange(event.target.value)}} />
               
                <button onClick={this.handleSubmit}> Search for Appointments </button> 
                <br />
                {
                    this.state.availTimings ?
                    this.state.availTimings.map((timings) => (
                        <button onClick={(event) => this.handleBooking(event,timings.time)}> {timings.time} </button>
                    )) : null
                }

            </div>
        )
    }
}

export default withCookies(BookAppointment);