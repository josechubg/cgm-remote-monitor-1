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
delete process.env.MONGODB_PASSWORD;
