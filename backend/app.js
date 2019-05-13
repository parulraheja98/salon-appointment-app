
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
var appointmentController = require('./controllers/appointment.js');



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

app.get('/removeappoint' , appointmentController.removeappoint);

app.get('/listofappointments',appointmentController.listofappointments);

app.post('/detailedinfo' , appointmentController.detailedinfo);

app.post('/searchAppointment', appointmentController.searchAppointment);

app.post('/processAppointment' , appointmentController.processAppointment);

app.get('/userinfo' , appointmentController.userinfo);

app.post('/delAppointment' , appointmentController.delAppointment);

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
