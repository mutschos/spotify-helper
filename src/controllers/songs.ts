import {Request, Response, Router} from 'express';
import SpotifyWebApi from 'spotify-web-api-node';

export class Songs {

  public static create(router: Router) {
    router.get('/songs/rarelyPlayed', (req: Request, res: Response) => {
        new Songs().getRarelyPlayed(req, res);
      });
  }

  private async getRarelyPlayed(req: Request, res: Response) {
    const spotifyApi = new SpotifyWebApi({accessToken: req.user.accessToken});
    const result = await spotifyApi.getMyRecentlyPlayedTracks();
    // tslint:disable-next-line:no-console
    console.log('Artist albums', result.body);
    res.end();
  }
}
