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

    const appKey = '5c21334e540249b281f0f198f21d0489';
    const appSecret = '8110f4cf726c4773860b0df2198c4320';

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
