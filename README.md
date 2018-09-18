[![Build Status](https://travis-ci.org/watsonwork/watsonwork-api-proxy.svg?branch=master)](https://travis-ci.org/watsonwork/watsonwork-api-proxy) [![Greenkeeper badge](https://badges.greenkeeper.io/watsonwork/watsonwork-api-proxy.svg)](https://greenkeeper.io/)

# Watson Work API Proxy

This is a proxy that allows accessing IBM Watson Work APIs with client credentials instead of OAuth access token.

## Basics

IBM Watson Work requires all API calls to include a bearer token. However, for some integration environments it may be problematic to include token calls and token refresh.

This proxy allows making calls to Watson Work APIs with your app's client credentials using Basic authentication. When called, proxy will exchange the credentials for the access token and forward the call to Watson Work.

## Operation
You can deploy the app yourself or use a version deployed already on bluemix under `https://watsonwork-api-proxy.mybluemix.net/`.

In order to make an API call, you just use a proxy hostname and the path of the API you want to call. For example, in order to call `https://watsonwork.ibm.com/graphql`, use `https://watsonwork-api-proxy.mybluemix.net/graphql`, or other hostname for your local deployment.

## Build and test
The build definition includes a simple test that verifies end-to-end proxy operation. The test requires 2 environment variables, `TEST_CLIENT_ID` and `TEST_CLIENT_SECRET` with values matchinge some active Watson Work app.
