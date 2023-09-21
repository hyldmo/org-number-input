# org-number

Adds an organisation number field with optional validation to your Shopify Plus Checkout

## Development

### Requirements

1. You must [download and install Node.js](https://nodejs.org/en/download/) if you don't already have it.
1. You must [create a Shopify partner account](https://partners.shopify.com/signup) if you don’t have one.
1. You must create a store for testing if you don't have one, either a
   [development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) or
   a [Shopify Plus sandbox store](https://help.shopify.com/en/partners/dashboard/managing-stores/plus-sandbox-store).

#### Local Development

[The Shopify CLI](https://shopify.dev/docs/apps/tools/cli) connects to an app in your Partners dashboard. It provides
environment variables and runs commands in parallel..

Run the following commands from the root of your app.

```shell
yarn dev
```

Open the URL generated in your console. Once you grant permission to the app, you can start development (such as
generating extensions).

## Developer resources

-   [Introduction to Shopify apps](https://shopify.dev/docs/apps/getting-started)
-   [App authentication](https://shopify.dev/docs/apps/auth)
-   [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
-   [Shopify API Library documentation](https://github.com/Shopify/shopify-api-js#readme)
