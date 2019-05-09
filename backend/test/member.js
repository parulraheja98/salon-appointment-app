const assert = require('assert');
const Member = require('../models/member.js');
const mongoose = require('mongoose');
const app = 'http://localhost:3017';
var chai = require('chai')
    , chaiHttp = require('chai-http');
mongoose.connect('mongodb://praheja:boldtest12345@ds163764.mlab.com:63764/shoppingcart');


describe('Creating new Member Tests' , function() {
    it('Create Member' , function(done)  {
        
        const member = new Member({
            username:'habbits',
            password:'testingch',
            email:'testing@gmail.com',
            amount:123,
            type:'test',
        })

        member.save()
        .then(function(mem) {
            console.log('testing here ');
            console.log('testing member 1');
            console.log(mem);
            console.log('testing member 2');
            assert(!member.isNew);
            done();
        })
        })
})


describe('Reading Member details' , function() {
    it('reading details' , function(done) {
        Member.findOne({username:'habbits'})
        .then((r) => {
            assert(r != null);
            return Member.deleteOne({username:'habbits'})
        }) 
        .then((memF) => {
            console.log('testing member 1');
            console.log(memF);
            console.log('testing member 2');
           assert(memF.n == 1);
           done();
        })

    })

})
