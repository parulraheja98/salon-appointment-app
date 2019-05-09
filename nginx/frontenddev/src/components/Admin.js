import React,{Component} from 'react';
import '../App.css';
import Timefield from 'react-simple-timefield';

class Admin extends Component {
    constructor() {
      super();
      this.state = { time: 0,valueSet:[''],date:''};
      this.handleTimeChange = this.handleTimeChange.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.addMore = this.addMore.bind(this);
      this.setDate = this.setDate.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    
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
        var counter =0;
        console.log(this.state.valueSet);
        console.log(event);
        console.log(i);
        var values = this.state.valueSet;
        values[i] = event;
        this.setState({values});
        
    }

    addMore() {
        console.log('testing debugger here 1');
        console.log(this.state.valueSet);
        console.log('testing debugger here 2');
        this.setState({valueSet:[...this.state.valueSet,'']});
        console.log(this.state.valueSet);
    }

    setDate(event) {
        event.preventDefault();
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
                date:this.state.date
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

        <div className='admin-main-container'>
            <input type='date' onChange={this.setDate} />
            
            {
                this.state.valueSet.map((values,i) => (
                    <div key={i}>
                        <Timefield className='timeInp'onChange={(event) => this.handleTesting(event,i)} />
                    </div>
                )
                )
            }

            <button onClick={this.addMore}> Add More Values </button>
            <button onClick={this.handleSubmit}> Submit </button>


        </div>


     )
    }
  }
export default Admin;
