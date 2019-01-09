import {Request, Response, Router} from 'express';
import { PassportStatic } from 'passport';

export class Login {

    public static create(router: Router, passport: PassportStatic) {
        router.get (
            '/login',
            passport.authenticate('spotify', {
              scope: [
                  'user-read-recently-played',
                  'user-library-read',
                  'playlist-modify-private',
                  'playlist-modify-public',
                 ],
            }),
            (req: any, res: any) => {
              // The request will be redirected to spotify for authentication, so this
              // function will not be called.
            },
        );

        router.get(
            '/callback',
            passport.authenticate('spotify', { failureRedirect: '/login' }),
            (req: Request, res: Response) => {
              new Login().callback(req, res);
            },
        );
    }

    private async callback(req: Request, res: Response) {
        const username = req.user.displayName;
        // tslint:disable-next-line:no-console
        console.log(username + ' is logged in');
        req.user.accessToken = req.authInfo.accessToken;
        res.redirect('/welcome.html');
    }
}
