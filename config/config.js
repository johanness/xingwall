var path     = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env      = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'xingwall'
    },
    port: 3000,
    db: 'mongodb://localhost/xingwall-development',
    xingApi: {
      consumerKey: process.env.XING_CONSUMER_KEY,
      consumerSecret: process.env.XING_CONSUMER_SECRET,
      oauthCallback: 'http://localhost:3000/oauth_callback'
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'xingwall'
    },
    port: 3000,
    db: 'mongodb://localhost/xingwall-test',
    xingApi: {
      consumerKey: process.env.XING_CONSUMER_KEY,
      consumerSecret: process.env.XING_CONSUMER_SECRET,
      oauthCallback: 'http://SETMEINCONFIG'
    }
  },

  production: {
    root: rootPath,
    app: {
      name: 'xingwall'
    },
    port: 3000,
    db: 'mongodb://localhost/xingwall-production',
    xingApi: {
      consumerKey: process.env.XING_CONSUMER_KEY,
      consumerSecret: process.env.XING_CONSUMER_SECRET,
      oauthCallback: 'http://SETMEINCONFIG'
    }
  }
};

module.exports = config[env];
