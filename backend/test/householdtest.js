const assert = require('assert');
const Household = require('../models/household.js');
const mongoose = require('mongoose');
const app = 'http://localhost:3017';
var chai = require('chai')
    , chaiHttp = require('chai-http');
mongoose.connect('mongodb://praheja:boldtest12345@ds163764.mlab.com:63764/shoppingcart');
var randHousehold = Math.random().toString(36).substring(7);
describe('Creating new Household Tests' , function() {
    it('Create Household ' , function(done)  {
        chai.request(app)
        .post('/addhousehold')
        .send({
            household:randHousehold
        }) 
        .end((err,data) => {
            assert(data.body.householdCreated);
            done();

        })
    })

})

/*

describe('Delete Household ' , function() {
    it('Delete Household' , function(done) {
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

*/