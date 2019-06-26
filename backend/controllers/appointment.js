var Appointment = require('../models/appointment.js');


var searchAppointment = (req,res,next) => {
    var dateAvail = new Date(req.body.date).toISOString().substring(0,10);
    if(req.body.date) {
        Appointment.find({$and:[{date:dateAvail}, {person:{$exists:0}},{timings: { 
            $elemMatch: { typeAppoint: req.body.desc }}
         }]} , (err,appoint) => {
            if(appoint.length) {
           var timingList = appoint[0].timings;
           var listOfTimes = [];
           for(var timeDesc of timingList) {
                if(timeDesc.typeAppoint == req.body.desc) {
                    listOfTimes.push(timeDesc.time);
                }
           }
           res.json({
               listOfTimes
           })
        }

        else {
        res.status(500).json({
            error:'Timings Donot Exist'
        })

    }

        })
    }
    else {
        res.status(500).json({
            error:'Date Not Entered'
        })
    }

}

var detailedinfo = (req,res,next) => {

    var date = req.body.date;
    var time = req.body.timeValOfAppointments;
    Appointment.find({$and:[
        {date},
        {person:{$exists:0}}

    ]}, (err,appoint) => {
        var timings = appoint[0].timings;
        var details = '';
        for(var timeInfo of timings) {
            if(timeInfo.time == time) {
                details = timeInfo;

            }
        }

       if(details) {
           res.status(200).json({
               details
           })
       }

       else {
            res.status(500).json({
                error:'No Detailed Info Found'
            })

       }

    })
}

    var processAppointment = (req,res,next) => {
    var timings = req.body.timeValOfAppointments;
    
    var booked;
    var person;
    if(typeof timings === 'string') {
        timings = [timings];
    }
    var date = req.body.date;  
    if(req.body.person) {
        person = req.body.person;
        booked = true;
    }

    else {
        booked = false;
    }

    var createTimings = [];
    
    for(var time of timings) {
        var checkTime = {
            time,
            booked
        }
        createTimings.push(checkTime);
    }  
    
    var typeDescription = req.body.typeDesc;
        var priceDescription = req.body.priceDesc;
        var createCheck = [];
        if(typeof typeDescription == 'string') {
            typeDescription = [typeDescription];
        }
        if(typeof priceDescription == 'number') {
            priceDescription = [priceDescription];
        }
        for(var [i,appointDetails] of timings.entries()) {
            var timingDetails = {
                time:timings[i],
                booked,
                typeAppoint:typeDescription[i],
                price:priceDescription[i]
            }
            createCheck.push(timingDetails);
        }
    
    if(person) {
        Appointment.find({$and:[{date},{person}]}, (err,appoint) => {
            if(appoint.length) {
                for(listOfTimings in timings) {
                function appointmentExists(timings) {
                    return appoint[0].timings.some(function(el) {
                      return el.time === timings;
                    }); 
                  }
                if(!appointmentExists(timings[listOfTimings])) {
                Appointment.update({$and:[{person},{date}]} , {$push:{timings:createCheck}} , {$new:true} , (err,updAppointment)  => {
                    console.log(updAppointment);
                })
                Appointment.update({$and:[{date},{person:{$exists:0}}]}, { "$pull": { "timings": { "time": timings[listOfTimings] } }}, { safe: true, multi:true }, function(err, obj) {
                });
            }


            }

            }

            else {

                var appointment = new Appointment({
                    person,
                    date,
                    timings:createCheck
                }).save();
                for(var timeList of createTimings) {
                Appointment.update({$and:[{date},{person:{$exists:0}}]}, { "$pull": { "timings": { "time": timeList.time } }}, { safe: true, multi:true }, function(err, obj) {
                    console.log(obj);
                });
            }

            }

        })

        
    }
    else {
        
        var indStore = [];
        Appointment.find({$and:[{person:{$exists:0}},{date}]} , (err,appoint) => {
            if(appoint.length > 0) {
            var timingSlots = appoint[0].timings;
            for(var [i,timeSlots] of timingSlots.entries()) {
                for(var [indTime,j] of timings.entries()) {
                    if(j == timeSlots.time){
                        indStore.push(indTime);
                    }
                }
            }

            for(var [i,timeSlots] of timings.entries()) {
                if(!(i in indStore)) {
                    var updTimings = {
                        time:timeSlots,
                        typeAppoint:typeDescription[i],
                        price:priceDescription[i],
                        booked:false
                    }
                    Appointment.update({$and:[{person:{$exists:0}},{date}]} , {$push:{timings:updTimings}} , {$new:true} , (err,updAppointment)  => {
                        console.log(updAppointment);
                    })
    
                }
            }
            
        }

        else {
            var appointment = new Appointment({
                date,
                timings:createCheck
            }).save();
    
        }

        })
  
    }

    if(req.body.timeValOfAppointments) {
        res.status(200).json({
            message:'Appointment Added Successfully'
        })
    }
    else {
        res.status(500).json({
            error:'Appointment Not Added '
        })
    }

    }




var userinfo = (req,res,next) => {

    Appointment.find({person:req.session.username}, (err,appoint) => {
    
        res.json({
            details:appoint
        })

    })

}

var delAppointment = (req,res,next) => {
    var date = req.body.date;
    var time = req.body.timingDetail.time;
    var price = req.body.timingDetail.price;
    var typeAppoint = req.body.timingDetail.typeAppoint;
    var person = req.session.username;
    var firstQuer = Appointment.update({$and:[{date},{person}]}, { "$pull": { "timings": { time} }}, { safe: true, multi:true })
    var updTimings = {
        time,
        typeAppoint,
        price,
        booked:false
    }
    

    var secondQuer = Appointment.update({$and:[{date},{person:{$exists:0}}]},{$push:{timings:updTimings}}, { safe: true, multi:true });

    Promise.all([firstQuer,secondQuer])
    .then(re => {
        if(re[0].n && re[1].n) {
            res.status(200).json({
                message:'Appointment deleted successfully'
            })
        }

        else {
            res.status(500).json({
                error:"Update Unsuccessfull"
            })
        }


    })

}

var listofappointments = (req,res,next) => {

    Appointment.find({} , (err,appoint) => {
        res.json({appoint});
    })

}

var removeappoint = (req,res,next) => {
    Appointment.remove({},(err,appoint) => {
       res.json({appoint});
    })
}

module.exports = {
    removeappoint,
    listofappointments,
    delAppointment,
    userinfo,
    detailedinfo,
    searchAppointment,
    processAppointment

}