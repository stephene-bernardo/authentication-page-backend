const express = require('express')
const app = express()
const port = 3000
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
const DatabaseSetup = require('./src/database')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./auth.db');
DatabaseSetup.execute().then(function () {
    app.use(bodyParser.json())
    app.use(function(req,res,next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next()
     })
    app.post('/auth', (req, res) => {
		console.log(req.body)
        db.each(`SELECT * FROM user_info WHERE username==\"${req.body.username}\" AND password==\"${req.body.password}\"`,
            (err, row) => res.send(jwt.sign(row.name, 'shhhhh')),
            (err, retrieveRow) => {
                if (retrieveRow === 0) {
                    res.send("Not Authenticated User")
                }
            });

    })

    app.get('/getUserInfo', (req, res) => {
        jwt.verify(req.headers.token, 'shhhhh', function (err, decoded) {
            console.log
            if (err) {
                res.send("Authentication failed")
            }
            db.each(`SELECT * FROM user_info WHERE name==\"${decoded}\"`, (err, row) => {
                res.send({"username": row.username, "name": row.name})
            })
        });
    })

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
});
