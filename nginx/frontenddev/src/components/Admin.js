import React,{Component} from 'react';
import {Form,Button} from 'react-bootstrap';
import '../App.css';
import Timefield from 'react-simple-timefield';

class Admin extends Component {
    constructor() {
      super();
      this.state = { time: 0,valueSet:[''],infoSet:[''],priceSet:[''],date:''};
      this.handleTimeChange = this.handleTimeChange.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.addMore = this.addMore.bind(this);
      this.setDate = this.setDate.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.checktest = this.checktest.bind(this);
      
      
    
    }
    
    checktest(event) {
        console.log('checking event 1');
        console.log(event);
        console.log('chekcing event 2');
    }
  
    handleTimeChange(time) {
      console.log(time);     // <- prints "3600" if "01:00" is picked
      this.setState({ time });
    }
    
    handleChange(time) {
       console.log('checking time here ');
        console.log(time);
       console.log('checking time here 2');
    }

    handleTesting(event,i) {
        console.log('checking event 1');
        console.log(event);
        console.log('checking event 2');
        var counter =0;
        console.log(this.state.valueSet);
        console.log(event);
        console.log(i);
        var values = this.state.valueSet;
        values[i] = event;
        this.setState({valueSet:values});
        
    }

    handleInfo(event,i) {
        var counter =0;
        console.log(this.state.infoSet);
        console.log(event);
        console.log(i);
        var values = this.state.infoSet;
        values[i] = event.target.value;
        this.setState({infoSet:values});
        
    }

    handlePrice(event,i) {
        var counter =0;
        console.log(this.state.priceSet);
        console.log(event);
        console.log(i);
        var values = this.state.priceSet;
        values[i] = event.target.value;
        this.setState({priceSet:values});
        console.log('checking state here 1');
        console.log(this.state);
        console.log('checking state here 2');
        
    }

    addMore() {
        console.log('testing debugger here 1');
        console.log(this.state.valueSet);
        console.log('testing debugger here 2');
        this.setState({valueSet:[...this.state.valueSet,'']});
        console.log(this.state.valueSet);
    }

    setDate(event) {
       
        this.setState({date:event.target.value});
    }
  
    handleSubmit() {
        console.log('checking final value test 1');
        console.log(this.state);
        console.log('checking final value complete');
        fetch('http://localhost:3017/processAppointment' , {
            method:'POST',
            credentials:'include',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                timeValOfAppointments:this.state.valueSet,
                typeDesc:this.state.infoSet,
                priceDesc:this.state.priceSet,
                date:this.state.date
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

        <Form className='admin-main-container'>
           
            <Form.Group>
            <Form.Label> Select Date for Appointment </Form.Label>
            <Form.Control type='date' onChange={this.setDate} />
            </Form.Group>
            
            
            {
                this.state.valueSet.map((values,i) => (
                    <div key={i}>

                        <Form.Group controlId='timeInp'>
                            <Form.Label> Enter Time for the Appointment </Form.Label> <br />
                            <Timefield  className='timeInp' onChange={(event) => this.handleTesting(event,i)} />
                        </Form.Group>
                        <Form.Group controlId='typeAppoint'>
                            <Form.Label> Enter Type of Appointment </Form.Label>
                            <Form.Control className='typeInp' onChange={(event) => this.handleInfo(event,i)} />
                        </Form.Group>
                        <Form.Group controlId='typeAppoint'>
                            <Form.Label> Enter Price for the Appointment </Form.Label>
                            <Form.Control className='priceInp' onChange={(event) => this.handlePrice(event,i)} />
                        </Form.Group>
                    </div>
                )
                )
            }

            <Button onClick={this.addMore}> Add More Values </Button> {" "}
            <Button onClick={this.handleSubmit}> Submit </Button>


        </Form>


     )
    }
  }
export default Admin;
