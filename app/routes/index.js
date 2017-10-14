const driveguardRoutes = require('./alparker_routes');
module.exports = function(app, db) {
  driveguardRoutes(app, db);
};
