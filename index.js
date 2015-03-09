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
        dominos.store.find(address, function(storeData) {
            res.status(200).json(storeData.result.Stores);
        });
    }
});

app.get('/v1/stores/:store_id', function(req, res) {
    var store_id = req.params.store_id;
    console.log('returning info for store ' + store_id);
    dominos.store.info(store_id, function(storeData) {
        if (storeData.success === false) {
            res.status(400).json({
                code: 'INVALID_STORE',
                title: 'Invalid Store',
                detail: 'Cannot retrieve the menu for a store with id `' + store_id + '`'
            });
        } else {
            res.status(200).json(storeData);
        }
    });
});

app.get('/v1/stores/:store_id/menu', function(req, res) {
    var store_id = req.params.store_id;
    console.log('returning info for store ' + store_id);
    dominos.store.menu(store_id, function(storeData) {
        if (storeData.success === false) {
            res.status(400).json({
                code: 'INVALID_STORE',
                title: 'Invalid Store',
                detail: 'Cannot retrieve the menu for a store with id `' + store_id + '`'
            });
        } else {
            res.status(200).json(storeData);
        }
    });
});

var port = process.env.PORT || 5000;
app.listen(port);
console.log("Now listening on " + port);
