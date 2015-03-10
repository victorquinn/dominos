var dominos = require('dominos');
var debug = require('debug')('pizza:cheese');

module.exports = {
    cheese: function(req, res) {
        // {
        //     "phone": "2028765309",
        //     "first": "Victor",
        //     "last": "Quinn",
        //     "email": "mail@victorquinn.com"
        //     "creditcard": {
        //         "number": "4111111111111111",
        //         "expiration": "0315",
        //         "security": "123",
        //         "postalcode": "20036"
        //     }
        // }

        // First, make the order

        var order = new dominos.class.Order();

        // Set the basics
        order.Order.Phone = req.body.phone;
        order.Order.FirstName = req.body.first;
        order.Order.LastName = req.body.last;
        order.Order.Email = req.body.email;
        order.Order.Address.Street = req.body.address;
        order.Order.Address.PostalCode = req.body.postalcode;
        order.Order.StoreID = req.body.store;
        order.Order.ServiceMethod = "Delivery";

        // @todo this should be the default, but allow other currencies via the API
        order.Order.Currency = "USD";

        // Add the large cheese pizza
        var cheesePizza = new dominos.class.Product();
        cheesePizza.Code='14SCREEN';
        order.Order.Products.push(cheesePizza);

        // Validate this order
        dominos.order.validate(order, function(data) {
            debug("validated order: %s", JSON.stringify(data, null, 2));
            if (data.success) {
                res.status(200).json({
                    order_id: data.result.Order.OrderID
                });
            } else {
                res.status(400).json(data.result);
            }
        });
    }
};
