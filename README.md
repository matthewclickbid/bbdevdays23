# bbdevdays23

Run the following to get started.

```sh
npm install
```

When using Chrome on local development, open Chrome with the following command

```sh
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
```

Rename env.sample to .env and provide the relevant data.

Run the following to start localhost.

```sh
npm run dev
```

## More Information

Use the following information to help you.

### ClickBid API

This code utilizes the V3 API from ClickBid. Specifically the endpoint:

> https://cbo.bid/api/v3/bigboard.php/bigboard/bids/TIMESTAMP
