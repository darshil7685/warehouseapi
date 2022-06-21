const mysql = require("mysql2");


var con = mysql.createConnection({
    host: "localhost",
    user: "darshil",
    database: "warehouse1",
    password: "darshil"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected db!");
});
module.exports = con;