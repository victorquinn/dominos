var dominos = require('dominos');

module.exports = {
    list: function(req, res) {
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
    },

    info: function(req, res) {
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
    },

    menu: function(req, res) {
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
    }
};
