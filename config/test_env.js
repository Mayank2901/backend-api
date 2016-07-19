/**
 * Expose
 */

module.exports = {
  db: 'mongodb://localhost/test',
  logDir: './logs/', //@todo : check if log directory exits, if not create one.
  sessionSecret: "thisisareallylongandbigsecrettoken",
  baseUrl: "http://costart.local:8000/",
  cookieDomain: ".costart.local"
};