import { PassportStatic, Profile } from 'passport';
import { Strategy, VerifyCallback } from 'passport-spotify';

export class PassportConfig {

  public setup(passport: PassportStatic) {

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((obj, done) => {
      done(null, obj);
    });

    const appKey = process.env.SpotifyHelperKey;
    const appSecret = process.env.SpotifyHelperSecret;

    passport.use(
      new Strategy(
        {
          callbackURL: 'http://localhost:8888/callback',
          clientID: appKey,
          clientSecret: appSecret,
        },
        (aToken: string, rToken: string, expiresIn: any, profile: Profile, done: VerifyCallback) => {
          return done(null, profile, {accessToken: aToken} );
        },
      ),
    );
  }
}
