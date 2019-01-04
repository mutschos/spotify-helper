import {Request, Response, Router} from 'express';

export class Home {

    public static create(router: Router) {
        router.get('/', (req: Request, res: Response) => {
            new Home().get(req, res);
          });
    }

    private get(req: Request, res: Response) {
        if (req.isUnauthenticated()) {
            res.redirect('/login');
        }
    }
}
