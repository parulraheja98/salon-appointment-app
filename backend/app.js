
var express = require('express'),
handlebars = require('express-handlebars').create({defaultLayout: 'main'});
require('dotenv').config();
var mongoose = require('mongoose');
mongoose.connect('mongodb://parulraheja98:boldtest12345@ds153566.mlab.com:53566/salon-appointment');
var app = express();
var cors = require('cors');
var moment = require('moment');
var credentials = require('./credentials.js');
var Member = require('./models/member.js');
var Appointment = require('./models/appointment.js');
var Verification = require('./models/verification.js');
var VerifyPassword = require('./models/verificationPassword.js');
var cookieSession = require('cookie-session');
var nodemailer = require('nodemailer');
var uuidV4 = require('uuid/v4');
var authenticationController = require('./controllers/authentication.js');



var counter = 0;
var md5 = require('md5');
var moment = require('moment');

var h = 0;
var handlebars = require('express-handlebars').create({
defaultLayout: 'main',
helpers: {
    debug: function () {
        console.log("Current Context");
        console.log("=================");
        console.log(this);
        return null
    },
    section: function (name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
    }
}
});


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3017);
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('body-parser').json());
app.set('trust proxy', 1)
app.use(
cookieSession({
    secret: 'keyboard cat',
    name: 'session',
    keys: ['key1', 'key2'],
    cookie: {secure: true}

}))

app.use(cors({credentials:true, origin:'http://localhost:85'}))

app.use(require('cookie-parser')(credentials.cookieSecret));

app.use(express.static(__dirname + '/public'));





var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
    user: 'parultestcheck1@gmail.com',
    pass: 'boldtest12345'
}
});

var mailOptions = {
from: 'parultestcheck1@gmail.com',
to: 'parulraheja98@gmail.com',
subject: 'Sending Email using Node.js',
text: 'That was easy!'
};


app.get('/testingraheja', (req,res) => {
Member.find({username:'testing9'},(err,appoint) => {
    res.send(appoint);
})

});

app.get('/remappoint' , (req,res) => {
    Appointment.remove({},(err,appoint) => {
        res.send(appoint);
    })
})


app.get('/listofappointments' , (req,res) => {
    Appointment.find({} , (err,appint) => {
        res.send(appint);
    })
})

app.get('/testmember' , (req,res) => {
    var appt = new Appointment({
        date:Date.now(),
        timings:['12:01','12:30']
    });
    appt.save().then((r) => {
       var member = new Member({
           username:'jaysean',
           password:'testcheck',
           listOfAppointments:appt
       }).save().then(r => {
           res.send('completed');
       })
    })

})

app.get('/checkmember' , (req,res) => {
    Member.find({username:'jaysean'})
    .populate('listOfAppointments')
    .exec((err,mem) => {
        if(err)
        res.send(err);
        res.send(mem);
    })
})

app.get('/testinghereapp' , (req,res) => {
    Appointment.find({date:'2019-05-04'} , (err,appoint) => {
        res.send(appoint);
    })
})

  

app.post('/detailedinfo' , (req,res) => {
    console.log('checking body 1');
    console.log(req.body);
    console.log('checking body 2'); 
    var date = req.body.date;
    var time = req.body.timeValOfAppointments;
    Appointment.find({$and:[
        {date},
        {person:{$exists:0}}

    ]}, (err,appoint) => {
        console.log('checking appoint 0');
        console.log(appoint);
        console.log('checking appoint 1');
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




})


app.post('/searchAppointment' , (req,res) => {
    console.log('checking date 1');
    console.log(req.body);
    var dateAvail = new Date(req.body.date).toISOString().substring(0,10);
    console.log(dateAvail);
    console.log('checking date 2');
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
           console.log('checking list of times 1');
           console.log(listOfTimes);
           console.log('checking list of times 2');
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
})

app.get('/testdel' , (req,res) => {
    Appointment.update({$and:[{ date:"2019-05-09"},{person:{$exists:0}}]}, { "$pull": { "timings": { "time": "15:00" } }}, { safe: true, multi:true }, function(err, obj) {
        console.log(obj);
        res.send('completed');
    });
})



app.post('/processAppointment' , (req,res) => {
    console.log('first check here ');
    console.log(req.body);
    console.log('second check here '); 
    var timings = req.body.timeValOfAppointments;
    
    var booked;
    var person;
    if(typeof timings === 'string') {
        timings = [timings];
    }
   
    console.log(typeof timings[0]);
    console.log(timings);
    var date = req.body.date;
    console.log('checking date value here 1');
    console.log(date);
    console.log('checking date value here 2');    
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
            console.log('shruti reaching here');
            priceDescription = [priceDescription];
        }
        console.log(priceDescription);
        for(var [i,appointDetails] of timings.entries()) {
            var timingDetails = {
                time:timings[i],
                booked,
                typeAppoint:typeDescription[i],
                price:priceDescription[i]
            }
            createCheck.push(timingDetails);
        }
    
     

    
    console.log('checking create timings 1');
    console.log(createTimings);
    console.log('checking create timings 2');
    if(person) {
        console.log('checking value of person 1');
        console.log(person);
        console.log('checking value of person 2');

        Appointment.find({$and:[{date},{person}]}, (err,appoint) => {
            console.log('debugger test 1');
            if(appoint.length) {
                for(listOfTimings in timings) {
                console.log('check list first');
                console.log(listOfTimings);
                console.log(appoint[0].timings);
                function appointmentExists(timings) {
                    return appoint[0].timings.some(function(el) {
                      return el.time === timings;
                    }); 
                  }
                console.log('check list second here');
                if(!appointmentExists(timings[listOfTimings])) {
                Appointment.update({$and:[{person},{date}]} , {$push:{timings:createCheck}} , {$new:true} , (err,updAppointment)  => {
                    console.log(updAppointment);
                })
                Appointment.update({$and:[{date},{person:{$exists:0}}]}, { "$pull": { "timings": { "time": timings[listOfTimings] } }}, { safe: true, multi:true }, function(err, obj) {
                    console.log(obj);
                });
            }


            }

            }

            else {

                console.log('debugger test 2');
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
            console.log('appoint here check 1');
            console.log(appoint);
            console.log(timings);
            console.log('appoint here check 2');
            var timingSlots = appoint[0].timings;
            for(var [i,timeSlots] of timingSlots.entries()) {
                console.log('separate test 1');
                console.log(timeSlots);
                console.log('separtate test 2');
                console.log('fun check 1');
                for(var [indTime,j] of timings.entries()) {
                    console.log(j);
                    if(j == timeSlots.time){
                        console.log('debugging test');
                        indStore.push(indTime);
                    }
                }
            }

            console.log('testing here parul 1');
            console.log(timingSlots);
            console.log('before value');
            console.log(indStore);
            for(var [i,timeSlots] of timings.entries()) {
                if(!(i in indStore)) {
                    console.log('time slot check here 1');
                    console.log(timeSlots);
                    console.log(typeDescription);
                    console.log(i);
                    console.log('time slot check here 2');  
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


})


app.get('/testingtime' , (req,res) => {
    var timeStorage = moment().format('LT');
    console.log(typeof timeStorage);
    res.send(moment().format('8:30'));
})

app.get('/firstcheck', (req,res) => {
    var appoint = new Appointment({
        date:Date.now(),
        timings:[
            '8:30','9:30'
        ]
    })
    appoint.save();
    res.send('completed');
})

app.get('/testingcheck', (req,res) => {
    Appointment.find({} , (err,appoint) => {
        res.send(appoint);
    })
})





//app.post('/generatepassword',authenticationController.generatepassword);

//app.get('/verifypassword/:verifytoken',authenticationController.verifytoken);

//app.post('/resetpass',authenticationController.resetpass);


/*

Will depend on the layout of the design IF we want the post request or get request

*/



//app.post('/validatetoken',authenticationController.validatetoken);







app.post('/processLogin1',authenticationController.processLogin);


app.post('/processReg1', authenticationController.processReg);


app.get('/sessioninfo', function (req, res) {
res.send(req.session);
})


app.use(function (req, res) {
res.status(404);
res.render('404');
})

app.use(function (err, req, res, next) {
console.log(err.stack);
res.status(500);
res.render('500');
})

app.listen(app.get('port'), function () {
console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate');
});

module.exports = app;
