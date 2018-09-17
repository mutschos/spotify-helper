var express = require('express'),
  session = require('express-session'),
  passport = require('passport'),  
  SpotifyStrategy = require('passport-spotify').Strategy;

var appKey = '5c21334e540249b281f0f198f21d0489';
var appSecret = '8110f4cf726c4773860b0df2198c4320';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: appKey,
      clientSecret: appSecret,
      callbackURL: 'http://localhost:8888/callback'
    },
    function(accessToken, refreshToken, expires_in, profile, done) {               
        return done(null, profile);      
    }
  )
);

var app = express();

app.use(session({ secret: Math.random().toString(36), resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', function(req, res) {  
  if(req.user !== undefined)  
    res.sendFile(__dirname + '/views/index.html');
  else{
    res.redirect('/login')
  }

});

app.get(
  '/login',
  passport.authenticate('spotify', {
    scope: ['user-read-recently-played', 'user-library-read', 'playlist-modify-private'],
    showDialog: true
  }),
  function(req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);

app.get(
  '/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    let username = req.user.displayName;
    console.log(username + ' is logged in');
    res.sendFile(__dirname + '/views/index.html');
  }
);

app.listen(8888, function(){
  console.log('spotify-helper listening on port 8888');
});