// require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const ngrok=require('ngrok');
const errorHandler = require('./_middleware/error-handler');
const db = require("./models");
// const initRoutes = require("./src/controllers/awb.routes");
const initRoutes = require("./routes/awb.routes");
global.__basedir = __dirname + "/..";

app.use(bodyParser.urlencoded({ extended: false }));
initRoutes(app);
db.sequelize.sync();
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/manager', require('./manager/manager.controller'));
app.use('/warehouse', require('./warehouse/warehouse.controller'))
app.use('/admin', require('./admin/admin.controller'));
app.use('/excel', require('./importData/importData.service'))
app.use('/order', require('./order/order.controller'));

app.use("*",(req,res,next)=>{
    throw "Path not found";
})
// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () =>{
console.log('Server listening on port ' + port)
});

ngrok.connect({
    proto : 'http',
    addr : port,
}, (err, url) => {
    if (err) {
        console.error('Error while connecting Ngrok',err);
        return new Error('Ngrok Failed');
    }
});