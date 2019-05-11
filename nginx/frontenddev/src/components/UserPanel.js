import React,{Component} from 'react';
import {ListGroup,Button} from 'react-bootstrap';

class UserPanel extends Component {

constructor(props) {
    super(props);
    this.state = {details:[]};
    
}

componentDidMount() {
    fetch('http://localhost:3017/userinfo',{
        credentials:'include'
    })
    .then(response => response.json())
    .then(data => {
        console.log('checking data 1');
        console.log(data);
        console.log('checking data 2');
        this.setState({details:data.details});
    })
}

handleDelAppoint(timingDetail,date) {
    console.log('testing 1');
    console.log(timingDetail);
    console.log(date);
    console.log('testing 2');
    fetch('http://localhost:3017/delAppointment' , {
        method:'POST',
        credentials:'include',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            timingDetail,
            date
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('checking data 1');
        console.log(data);
        console.log('checking data 2');
        fetch('http://localhost:3017/userinfo',{
        credentials:'include'
        })
        .then(response => response.json())
        .then(data => {
            console.log('checking data 1');
            console.log(data);
            console.log('checking data 2');
            this.setState({details:data.details});
        })
    }) 

}

render() {

    return (
        <div>
        {

            this.state.details ?
           

            this.state.details.map((info) => (
                <div>
            <ListGroup variant="flush">
            { info.timings.length > 0 ?
                <ListGroup.Item variant='primary'>Appointment Date :- {info.date.substring(0,10)}</ListGroup.Item>
                : null
            }
                {
                    info.timings.map((timingDetail) => (
                    <ListGroup variant="flush" style={{border:'2px solid black'}}>
                        <ListGroup.Item>Appointment Time :- {timingDetail.time}</ListGroup.Item>
                        <ListGroup.Item>Appointment Type :- {timingDetail.typeAppoint}</ListGroup.Item>
                        <ListGroup.Item>Appointment Cost :- {timingDetail.price}</ListGroup.Item>
                        <ListGroup.Item> <Button onClick={() => this.handleDelAppoint(timingDetail,info.date)}> Delete Appointment </Button> </ListGroup.Item>
                    </ListGroup>

                ))

                }
                
            </ListGroup>


                </div>


            ))

            : null 

            

        }

            

    

    </div>

    )
}

}

export default UserPanel;