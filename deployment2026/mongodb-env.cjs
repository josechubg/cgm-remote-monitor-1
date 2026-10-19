'use strict';

// Build the connection string in memory. Never print credentials or the URI.
const required = ['MONGODB_USER', 'MONGODB_PASSWORD', 'MONGODB_HOST', 'MONGODB_DATABASE'];
const missing = required.filter(key => !process.env[key]);
if (missing.length) {
  throw new Error('Missing required MongoDB settings: ' + missing.join(', '));
}

const encode = value => encodeURIComponent(value).replace(/[!'()*]/g,
  character => '%' + character.charCodeAt(0).toString(16).toUpperCase());

process.env.MONGODB_URI = 'mongodb+srv://' + encode(process.env.MONGODB_USER) + ':' +
  encode(process.env.MONGODB_PASSWORD) + '@' + process.env.MONGODB_HOST + '/' +
  encode(process.env.MONGODB_DATABASE) + '?retryWrites=true&w=majority&authSource=admin';

// Nightscout only needs the resulting URI.
const protectedMongoPassword = process.env.MONGODB_PASSWORD;
delete process.env.MONGODB_PASSWORD;

// Redact configured credentials before application console messages reach Render.
const util = require('node:util');
const secretKeys = ['MONGODB_URI', 'CONNECT_SHARE_PASSWORD', 'API_SECRET'];
const secrets = [protectedMongoPassword, ...secretKeys.map(key => process.env[key])].filter(Boolean);
const variants = [...new Set(secrets.flatMap(value => [
  value, encodeURIComponent(value), util.inspect(value).slice(1, -1),
  JSON.stringify(value).slice(1, -1)
]))].sort((a, b) => b.length - a.length);
const redact = text => variants.reduce((result, secret) =>
  result.split(secret).join('[REDACTED]'), text);
for (const method of ['log', 'info', 'warn', 'error', 'debug']) {
  const original = console[method].bind(console);
  console[method] = (...args) => original(redact(util.format(...args)));
}
const originalDir = console.dir.bind(console);
console.dir = (object, options) => originalDir(redact(util.inspect(object, options)));
