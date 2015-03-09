# Pinpoint Pizza

## What is this?

This is a simple REST API server built using the excellent [Dominos node module](https://www.npmjs.com/package/dominos) by [@RIAEvangelist](https://github.com/RIAEvangelist)

## API

The REST API this creates when run:

### Stores

| Method | Endpoint                  | Description                                            | Example                        |
|--------|---------------------------|--------------------------------------------------------|--------------------------------|
| GET    | /v1/stores                | Get a list of stores near the supplied address         | /v1/stores?address=123 Main St |
| GET    | /v1/stores/:store_id      | Get detailed info about the store with the supplied id | /v1/stores/4344                |
| GET    | /v1/stores/:store_id/menu | Get the menu of the store with the supplied id         | /v1/stores/4344/menu           |

### Order

| Method | Endpoint        | Description                                                  | Example |
|--------|-----------------|--------------------------------------------------------------|---------|
| POST   | /v1/orders      | Create an order                                              |         |
| POST   | /v1/ordercheese | Convenience method to immediately order a large cheese pizza |         |
