/**
 * Expose
 */

module.exports = {
  db: process.env.MONGO_URL || 'mongodb://mongo.rightfit.io/rightfit', //'mongodb://root:root@ds045027.mongolab.com:45027/askparrot_api',
  logDir: './logs/', //@todo : check if log directory exits, if not create one.
  sessionSecret: "thisisareallylongandbigsecrettoken",
  baseUrl: "http://costart.local:8000/",
  cookieDomain: ".costart.local"
};