const assert = require('assert');
const Member = require('../models/member.js');
const mongoose = require('mongoose');
const app = require('../app.js');
var chai = require('chai')
    , chaiHttp = require('chai-http');
mongoose.connect('mongodb://praheja:boldtest12345@ds163764.mlab.com:63764/shoppingcart');

var randUser = Math.random().toString(36).substring(7);

describe('Make User Account' , function() {
    it('Make Account ' , function(done)  {
        chai.request(app)
        .post('/processReg1')
        .send({
            uname:randUser,
            pword:'another',
            pword2:'another'
        })
        .end((err,data) => {
            assert(data.body.authorized);
            done();

        })

        })

    })


describe('Login User Account' , function() {
    it('Login Account ' , function(done)  {
        chai.request(app)
        .post('/processLogin1')
        .send({
            uname:randUser,
            pword:'another'
        })
        .end((err,data) => {
            assert(data.body.authorized);
            done();

        })

        })

    })

    describe('Delete User Account' , function() {
        it('Delete Account' , function(done) {
            Member.deleteOne({username:randUser})
            .then((mem) => {
                return Member.findOne({username:randUser})
            })
            .then((data) => {

                assert(data == null);
                done();
            })


        })
    })