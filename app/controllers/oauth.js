var config   = require('../../config/config'),
    XINGApi  = require('xing-api'),
    mongoose = require('mongoose'),
    Profile  = mongoose.model('Profile'),
    Wall     = mongoose.model('Wall'),
    xingApi  = new XINGApi(config.xingApi);

module.exports = function (app, io) {
  app.get('/', function (req, res, next) {
    Wall.find(function (err, walls) {
      if (err) {
        console.err(err);
      }
      res.render('index', { walls: walls });
    });
  });

  app.get('/connect', function (req, res, next) {
    xingApi.getRequestToken(function (oauthToken, oauthTokenSecret, authorizeUrl) {
      res.cookie('requestToken',
        JSON.stringify({ token: oauthToken, secret: oauthTokenSecret }),
        { signed: true });

      res.redirect(authorizeUrl);
    });
  });

  app.get('/oauth_callback', function (req, res, next) {
    var requestToken = JSON.parse(req.signedCookies.requestToken);

    xingApi.getAccessToken(requestToken.token, requestToken.secret, req.query.oauth_verifier,
      function (error, oauthToken, oauthTokenSecret) {
        res.cookie('requestToken', null); // delete cookie

        var client = xingApi.client(oauthToken, oauthTokenSecret);

        client.get('/v1/users/me', function (error, response) {
          var user = JSON.parse(response).users[0];

          var profile = new Profile({
            displayName: user.display_name,
            photoUrls: {
              size_64x64: user.photo_urls.size_64x64,
              size_256x256: user.photo_urls.size_256x256
            }
          }).toObject();

          delete profile._id;

          Profile.update({ _id: user.id }, profile, { upsert: true }, function (err, rows, raw) {
            if (err) {
              console.error(err);
            }

            Profile.findOne({ _id: user.id }, function (err, _profile) {
              console.log('_profile', _profile);
              io.emit('profiles:updated', { profile: _profile });

              res.render('oauth/callback');
            });

          });
        });
      });
  });
};
