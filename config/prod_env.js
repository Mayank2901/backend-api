/**
 * Expose
 */

module.exports = {
  db: 'mongodb://' + process.env.MONGODB_SERVER || 'mongo.rightfit.io:27017' + '/rightfit',
  logDir : '/var/log/api/', //@todo : check if log directory exits, if not create one.
  sessionSecret: "thisisareallylongandbigsecrettoken"
};