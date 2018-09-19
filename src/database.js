
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./auth.db');
var Promise = require('promise');

module.exports = {
    databaseSetup: function () {
        return new Promise(function(fulfill)  {
            db.serialize(function() {
                db.each("select * from user_info", function(err,row) {
                    if(!row){
                        db.serialize(function(){
                            createUserInfoTable()
                            setUpDefaultUsers()
                            showAllUsers(fulfill)    
                        })
                    } 
                })
              });
        })
    }
}

function createUserInfoTable(){
    db.run("CREATE TABLE user_info (username TEXT UNIQUE, password TEXT, name TEXT)"); 
}
function showAllUsers(fulfill){
    db.each("SELECT * FROM user_info", function(err, row) {
        console.log(row);
    }, fulfill);
}
function setUpDefaultUsers(){
    
    var stmt = db.prepare("INSERT INTO user_info VALUES (?, ?, ?)");
        
    stmt.run("kbernard", "secret", "karl bernardo");
    stmt.run("foo", "bar", "foo bar")
    stmt.run("spammy", "secret", "spammy pizzo")

    stmt.finalize();
}