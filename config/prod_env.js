/**
 * Expose
 */

module.exports = {
  db: 'mongodb://' + process.env.MONGODB_SERVER ,
  logDir : '/var/log/api/', //@todo : check if log directory exits, if not create one.
  sessionSecret: "thisisareallylongandbigsecrettoken"
};