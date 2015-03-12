var dominos = require('dominos');
var debug = require('debug')('pizza:cheese');
var creditcard = require('creditcard');

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

        // @todo add validation

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

        // Add payment info
        var card = new dominos.class.Payment();
        if (!creditcard.validate(req.body.creditcard.number)) {
            res.status(400).json({
                code: 'INVALID_CREDIT_CARD',
                title: 'Invalid credit card',
                detail: 'Cannot order pizza with an invalid credit card'
            });
        }

        card.Number = req.body.creditcard.number;
        card.CardType = creditcard.cardscheme(req.body.creditcard.number).toUpperCase();
        if (card.CardType === 'American Express') {
            card.CardType = 'AMEX';
        }
        card.SecurityCode = req.body.creditcard.security;
        card.PostalCode = req.body.creditcard.postalcode;
        card.Expiration = req.body.creditcard.expiration;

        debug('order before being sent: %s', JSON.stringify(order, null, 2));

        // Validate this order
        dominos.order.validate(order, function(data) {
            var order_id = data.result.Order.OrderID;
            if (data.success) {
                dominos.order.price(order, function(data) {
                    var amount = {
                        total: data.result.Order.Amounts.Payment,
                        subtotal: data.result.Order.Amounts.Net,
                        tax: data.result.Order.Amounts.Tax
                    };

                    card.Amount = amount.total;
                    order.Order.Payments.push(card);
                    //                    debug('')
                    dominos.order.place(order, function(data) {
                        if (data.result.Status === -1) {
                            res.status(400).json({
                                code: data.result.Order.CorrectiveAction.Code,
                                detail: data.result.Order.CorrectiveAction.Detail
                            });
                        } else {
                            debug('ORDER SUCCESSFUL!');
                            dominos.track.phone(req.body.phone, function(pizzaData){
                                debug("Tracking enabled: %s", JSON.stringify(pizzaData, null, 4));
                            });
                            res.status(200).json({
                                order_id: order_id,
                                amount: amount
                            });
                        }
                    });
                });
            } else {
                // Need to better handle failure if no address or something
                res.status(400).json(data.result);
            }
        });
    }
};
