var express = require('express');
var app = express();

var stores = require('./stores');
var order = require('./order');

app.use(require('body-parser').json());

app.get('/v1/stores', stores.list);
app.get('/v1/stores/:store_id', stores.info);
app.get('/v1/stores/:store_id/menu', stores.menu);

app.post('/v1/ordercheese', order.cheese);

var port = process.env.PORT || 5000;
app.listen(port);
console.log("Now listening on " + port);
