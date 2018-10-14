
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./auth.db');
var Promise = require('promise');

class DatabaseSetup {
    static execute() {
        return new Promise((fulfill) => this.createTableAndGenerateUsers(fulfill))
    }

    static createTableAndGenerateUsers(callback) {
        let that = this;
        db.serialize(function () {
            db.each("select * from user_info", function (err, row) {
                if (!row) {
                    db.serialize(function () {
                        that.createUserInfoTable()
                        that.setUpDefaultUsers()
                        that.showAllUsers(callback)
                    })
                }
                else {
                    callback()
                }
            })
        });
    }
    static createUserInfoTable() {
        db.run("CREATE TABLE user_info (username TEXT UNIQUE, password TEXT, name TEXT)");
    }
    static showAllUsers(fulfill) {
        db.each("SELECT * FROM user_info", function (err, row) {
            console.log(row);
        }, fulfill);
    }
    static setUpDefaultUsers() {

        var stmt = db.prepare("INSERT INTO user_info VALUES (?, ?, ?)");
        stmt.run("kbernard", "secret", "karl bernardo");
        stmt.run("foo", "bar", "foo bar")
        stmt.run("spammy", "secret", "spammy pizzo")

        stmt.finalize();
    }
}


module.exports = DatabaseSetup;
