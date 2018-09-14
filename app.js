const request = require('request');
const httpProxy = require('http-proxy');
const http = require('http');
const auth = require('basic-auth');

const log = require('debug').debug('watsonwork-apiproxy');

const tokens = {}; // token cache

const requestToken = (clientId, clientSecret, cb) => {
  request.post('https://api.watsonwork.ibm.com/oauth/token', {
    auth: {
      user: clientId,
      pass: clientSecret
    },
    json: true,
    form: {
      grant_type: 'client_credentials'
    }
  }, (err, res) => {
    if (err || res.statusCode !== 200) {
      return cb(err || new Error(res.statusCode));
    }
    return cb(null, res.body);
  });
};

const getToken = (clientId, clientSecret, cb) => {
  let id = clientId + clientSecret;
  if (tokens[id] && tokens[id].exp - Date.now() > 60) {
    log('Token in cache');
    return cb(null, tokens[id].token);
  }
  requestToken(clientId, clientSecret, (err, res) => {
    if (err) return cb(err);
    log('Got new token');
    tokens[id] = { token: res.access_token, exp: res.expires_in };
    return cb(null, tokens[id].token);
  });
};

const proxy = httpProxy.createProxy();
const server = http.createServer((req, res) => {
  let basic = auth(req);
  if (!basic) {
    res.writeHead(401, 'No Basic Authorization header');
    res.end();
    return;
  }
  getToken(basic.name, basic.pass, (err, token) => {
    if (err) {
      log(err);
      res.writeHead(401, 'Could not get the token');
      res.end();
      return;
    }
    proxy.web(req, res, {
      target: 'https://api.watsonwork.ibm.com/',
      changeOrigin: true,
      headers: { 'Authorization': `Bearer ${token}` }
    });
  });
});
server.listen(process.env.PORT);

module.exports = server;
