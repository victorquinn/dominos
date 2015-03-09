var express = require('express');
var app = express();
var dominos = require('dominos');

app.use(require('body-parser').json());

app.get('/v1/stores', function(req, res) {
    var address = req.query.address;
    if (!address) {
        res.status(400).json({
            code: 'MISSING_ADDRESS',
            title: 'Missing Address',
            detail: 'Cannot order pizza without an address'
        });
    } else {
        console.log('returning stores for ' + address);
        dominos.store.find(
            address,
            function(storeData){
                res.status(200).json(storeData.result.Stores);
            }
        );
    }
});

var port = process.env.PORT || 5000;
app.listen(port);
console.log("Now listening on " + port);
