const express = require('express')
const app = express()
const port = 3000
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
const DatabaseSetup = require('./src/database')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./auth.db');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var request = require('request')


DatabaseSetup.execute().then(function () {
    app.use(bodyParser.json())
    app.use(function(req,res,next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
        next()
     })
    app.post('/auth', (req, res) => {
        db.each(`SELECT * FROM user_info WHERE username==\"${req.body.username}\" AND password==\"${req.body.password}\"`,
            (err, row) => res.send(jwt.sign(row.name, 'shhhhh')),
            (err, retrieveRow) => {
                if (retrieveRow === 0) {
                    res.send("Not Authenticated User")
                }
            });

    })

    app.get('/auth/getDBUserInfo', (req, res) => {
        console.log(req.headers)
        jwt.verify(req.headers.token, 'shhhhh', function (err, decoded) {
            
            if (err) {
                res.send("Authentication failed")
            }
            db.each(`SELECT * FROM user_info WHERE name==\"${decoded}\"`, (err, row) => {
                res.send({"username": row.username, "name": row.name})
            })
        });
    })

    app.get('/auth/getGoogleInfo', (req, ress)=>{
        request(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.headers.token}`, (err, res, body)=>{
            parseJson =JSON.parse(body)
            ress.send({"username": parseJson['email'], "name": parseJson['name']})
        })
    });

    app.get('/auth/getFacebookInfo', (req,res) =>{
        request(`https://graph.facebook.com/me?fields=name,email&access_token=${req.headers.token}`, (err, response, body)=>{
            parseJson =JSON.parse(body)
            res.send({"username":parseJson['email'], "name": parseJson['name']})
        })
    })
  
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
});
