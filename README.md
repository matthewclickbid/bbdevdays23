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
> Authorization: Basic (Event ID:API KEY)

This endpoint allows you to gather bids from a ClickBid event based on a starting point. TIMESTAMP in this case refers to a UNIX timestamp value. For your first call, you can pass a 1 which will represent all donations since the beginning of the event.

The API will return a new TIMESTAMP based on the time the call was made. Passing this TIMESTAMP into the next call will return data since the the last time the endpoint was called.

You can find your Event ID and API Key in your ClickBid account under Software Settings > Event Settings > API and on the top of the admin page in the blue banner (Event ID listed after event name).
