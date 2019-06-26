var Member = require('../models/member.js');
var md5 = require('md5');

var processLogin = (req,res,next) => {
    checkLogin(req, res, req.body.uname.trim(), req.body.pword.trim())
}

var checkLogin = (req, res, uname, password, next) => {

    Member.findOne({
        username: uname
    }, function(err, userdata) {

        if (!userdata) {
            res.status(404).send({
                error: " User not found"
            });
        } else if (userdata.password == md5(password)) {
            req.session.username = userdata.username;
            res.status(200).json({
                authorized: true,
                username: req.session.username
            });

        } else {
            res.status(401).json({
                authorized: false
            });

        }

    })

}



var processReg = (req,res,next) => {
    Member.find({
        username: req.body.uname
    })
    .then((mem) => {
        if (mem.length) {
            res.status(401).send({
                authorized: false,
                message: 'User Already Exists '
            });
        } else if (req.body.pword.trim() == req.body.pword2.trim()) {

            if (req.body.household) {


                var newUser = Member({
                    username: req.body.uname,
                    password: md5(req.body.pword),
                    email: req.body.email

                })


            } else {

                var newUser = Member({
                    username: req.body.uname,
                    password: md5(req.body.pword),
                    email: req.body.email

                })

            }

            newUser.save();
            res.status(200).send({
                authorized: true
            })
        } else {
            res.status(401).send({
                message: 'Incorrect Password Entered',
                authorized: false
            });

        }

    })
}



module.exports = {
    processLogin,
    checkLogin,
    processReg


}