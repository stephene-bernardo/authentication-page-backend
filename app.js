const express = require('express')
const app = express()
const port = 3000
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
const data = require('./src/database')

data.databaseSetup().then(function(){
    app.use(bodyParser.json())
    app.post('/auth', (req, res) => {
    
        var token = jwt.sign(req.body, 'shhhhh');
        res.send(token)
    })
    
    app.get('/verifyToken', (req,res) => {
        jwt.verify(req.headers.token, 'shhhhh', function(err, decoded) {
            if(err){
                res.send("Authentication failed")
            }
            res.send(decoded)
        });
    })
    
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
});
