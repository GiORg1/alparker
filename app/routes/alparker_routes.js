const request = require('request');

module.exports = function(app, db) {
  app.get('/', (req, res) => {
    res.end('Alparker');
  });

  app.get('/api/park_spaces/all', (req, res) => {
    request.get({
      url: ' http://api.thingtia.cloud/data/test2/sensor1?limit=200',
      headers: {
        'IDENTITY_KEY' : '28e9539fcccd99465ae3eb9bb7bc421e86920b890d9f4641363f02c8c02d2944'
      },
      method: 'GET'
    },

    function (e, r, body) {
      //console.log(body);
      res.send(body);
    });
  });

  app.get('/api/park_spaces/:N', (req, res) => {
    var n = req.params.N;
    request.get({
      url: ' http://api.thingtia.cloud/data/test2/sensor1?limit=' + n,
      headers: {
        'IDENTITY_KEY' : '28e9539fcccd99465ae3eb9bb7bc421e86920b890d9f4641363f02c8c02d2944'
      },
      method: 'GET'
    },

    function (e, r, body) {
      console.log(body);
      res.send(body);
    });
  });

  //app.get('/api/')
};
