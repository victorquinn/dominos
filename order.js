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
        debug("The body is %s", JSON.stringify(req.body, null, 4));

        var order = new dominos.class.Order();

        // Set the basics
        order.Order.Phone = req.body.phone;
        order.Order.FirstName = req.body.first;
        order.Order.LastName = req.body.last;
        order.Order.Email = req.body.email;
        order.Order.StoreID = req.body.store;
        order.Order.ServiceMethod = 'Delivery';

        // Add the address
        order.Order.Address.Street = req.body.address.street;
        order.Order.Address.City = req.body.address.city;
        order.Order.Address.PostalCode = req.body.address.postalcode;
        order.Order.Address.Region = req.body.address.region;

        // Add the large cheese pizza
        var cheesePizza = new dominos.class.Product();
        cheesePizza.Code='14SCREEN';
        order.Order.Products.push(cheesePizza);

        debug('order before being sent: %s', JSON.stringify(order, null, 2));

        // Validate this order
        dominos.order.validate(order, function(data) {
            debug('validated order: %s', JSON.stringify(data, null, 2));
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
